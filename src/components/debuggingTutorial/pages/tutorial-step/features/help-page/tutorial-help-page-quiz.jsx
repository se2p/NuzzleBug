import css from './tutorial-help-page-quiz.css';
import React, {useEffect, useRef, useState} from 'react';
import {FitToWidth} from '../../../../shared/utils.jsx';

const TutorialHelpPageQuiz = ({vm, quizMessages}) => {
    const [spriteUrls, setSpriteUrls] = useState([]);
    const prevBlobUrlsRef = useRef([]); // merkt sich die zuletzt erzeugten blob: URLs

    useEffect(() => {
        let cancelled = false;

        async function run () {
            if (!vm?.runtime) return;

            const sprites = (vm.runtime.targets ?? []).filter(t => !t.isStage);

            try {
                const urls = await Promise.all(
                    sprites.map(async sprite => {
                        const costume = sprite?.sprite?.costumes?.[sprite.currentCostume];
                        if (!costume) return null;
                        return await costumeToUrl(vm, costume); // kann blob: oder data: zurückgeben
                    })
                );

                const cleaned = urls.filter(Boolean);

                if (cancelled) {
                    // Wenn wir schon unmounted sind: direkt freigeben
                    revokeBlobUrls(cleaned);
                    return;
                }

                // Alte blob: URLs freigeben, bevor wir neue setzen
                revokeBlobUrls(prevBlobUrlsRef.current);

                // Neue blob: URLs merken
                prevBlobUrlsRef.current = cleaned.filter(u => typeof u === 'string' && u.startsWith('blob:'));

                setSpriteUrls(cleaned);
            } catch (e) {
                if (!cancelled) {
                    revokeBlobUrls(prevBlobUrlsRef.current);
                    prevBlobUrlsRef.current = [];
                    setSpriteUrls([]);
                }
            }
        }

        run();

        return () => {
            cancelled = true;
            // Beim Unmount: aktuelle blob: URLs freigeben
            revokeBlobUrls(prevBlobUrlsRef.current);
            prevBlobUrlsRef.current = [];
        };
    }, [vm]);

    const [questionIndex, setQuestionIndex] = useState(0);
    const kognitionOptions = [
        quizMessages.verySure,
        quizMessages.somewhatSure,
        quizMessages.notSureAtAll
    ];

    const increaseQuestionIndex = () => {
        setQuestionIndex(questionIndex + 1);
    };
    const blockTypes = [
        [quizMessages.movement, '#4c97ffff'],
        [quizMessages.looks, '#9966ffff'],
        [quizMessages.sound, '#d65cd6ff'],
        [quizMessages.events, '#ffd500ff'],
        [quizMessages.control, '#ffab19ff'],
        [quizMessages.sensing, '#4cbfe6ff'],
        [quizMessages.operators, '#40bf4aff'],
        [quizMessages.variables, '#ff8c1aff']];

    const getQuestionText = () => {
        switch (questionIndex) {
        case 0: return <strong>{quizMessages.questionFigure}</strong>;
        case 1: return <strong>{quizMessages.questionBlockType}</strong>;
        case 2: return <strong>{quizMessages.questionConfidence}</strong>;
        case 4: return <strong> </strong>;
        }
    };

    return (
        <div className={css.helpPageQuiz}>
            {questionIndex === 0 && <span>{quizMessages.intro}<br /></span>}
            {getQuestionText()}

            {questionIndex === 0 && <div
                className={css.qaOptions}
                role="group"
                aria-label="Antwortoptionen"
            >
                {spriteUrls.length === 0 ? (
                    <button
                        className={css.qaOption}
                        type="button"
                        disabled
                    >
                        <span className={css.pill}>Lade Sprites…</span>
                    </button>
                ) : (
                    <>
                        {spriteUrls.map((url, i) => (
                            <button
                                key={url ?? i}
                                className={css.qaOption}
                                type="button"
                                onClick={() => {
                                    increaseQuestionIndex();
                                }}
                            >
                                <FitToWidth>
                                    <img
                                        src={url}
                                        alt=""
                                    />
                                </FitToWidth>
                            </button>
                        ))}
                        <button
                            className={css.qaOption}
                            type="button"
                            onClick={() => {
                                increaseQuestionIndex();
                            }}
                        >
                            <span className={css.pill}>{quizMessages.other}</span>
                        </button>
                    </>
                )}
            </div>}

            {questionIndex === 1 && <div className={css.centerRow}>
                <div
                    className={css.gridOptions}
                    role="group"
                    aria-label="Antwortoptionen"
                >
                    {blockTypes.map(item => (
                        <button
                            key={item[1]}
                            className={css.blockTypeOption}
                            type="button"
                            onClick={() => {
                                increaseQuestionIndex();
                            }}
                        >
                            <div
                                className={css.circle}
                                style={{backgroundColor: item[1]}}
                            />
                            <span>{item[0]}</span>
                        </button>
                    ))}
                </div>
            </div>}

            {questionIndex === 2 && <div
                className={css.verticalOptions}
                role="group"
                aria-label="Antwortoptionen"
            >
                {kognitionOptions.map((text, i) => (
                    <button
                        key={text ?? i}
                        className={`${css.qaOption} ${css.qaOptionTall}`}
                        type="button"
                        onClick={() => {
                            increaseQuestionIndex();
                        }}
                    >
                        {text}
                    </button>
                ))}
            </div>}

            {questionIndex === 3 && <div className={css.verticalText}>
                <strong>{quizMessages.finished}</strong>
            </div>}
        </div>
    );


    function revokeBlobUrls (urls) {
        if (!Array.isArray(urls)) return;
        for (const u of urls) {
            if (typeof u === 'string' && u.startsWith('blob:')) {
                URL.revokeObjectURL(u);
            }
        }
    }

    function ensureSvgRenders (svgText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svg = doc.documentElement;

        if (!svg || svg.nodeName.toLowerCase() !== 'svg') return svgText;

        if (!svg.getAttribute('xmlns')) {
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }

        if (!svg.hasAttribute('viewBox')) {
            const parseSize = v => {
                if (!v) return NaN;
                const m = String(v).trim()
                    .match(/^(-?\d+(\.\d+)?)/);
                return m ? Number(m[1]) : NaN;
            };

            const w = parseSize(svg.getAttribute('width'));
            const h = parseSize(svg.getAttribute('height'));

            if (Number.isFinite(w) && w > 0 && Number.isFinite(h) && h > 0) {
                svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
            } else {
                svg.setAttribute('viewBox', '0 0 480 360');
            }
        }

        return new XMLSerializer().serializeToString(svg);
    }

    async function costumeToUrl (vm, costume) {
        const storage = vm.runtime.storage;
        const fmt = (costume.dataFormat || '').toLowerCase();
        const isSvg = fmt === 'svg';

        const existingAsset = costume.asset;
        if (existingAsset) {
            if (isSvg) {
                const rawSvgText =
                    typeof existingAsset.data === 'string' ?
                        existingAsset.data :
                        new TextDecoder('utf-8').decode(existingAsset.data);

                const fixedSvgText = ensureSvgRenders(rawSvgText);
                return URL.createObjectURL(
                    new Blob([fixedSvgText], {type: 'image/svg+xml;charset=utf-8'})
                );
            }

            if (typeof existingAsset.encodeDataURI === 'function') {
                return existingAsset.encodeDataURI();
            }

            const mime =
                fmt === 'png' ? 'image/png' :
                    (fmt === 'jpg' || fmt === 'jpeg') ? 'image/jpeg' :
                        'application/octet-stream';

            return URL.createObjectURL(new Blob([existingAsset.data], {type: mime}));
        }

        const assetType = isSvg ? storage.AssetType.ImageVector : storage.AssetType.ImageBitmap;
        const asset = await storage.load(assetType, costume.assetId, costume.dataFormat);

        if (isSvg) {
            const rawSvgText =
                typeof asset.data === 'string' ?
                    asset.data :
                    new TextDecoder('utf-8').decode(asset.data);

            const fixedSvgText = ensureSvgRenders(rawSvgText);
            return URL.createObjectURL(
                new Blob([fixedSvgText], {type: 'image/svg+xml;charset=utf-8'})
            );
        }

        if (typeof asset.encodeDataURI === 'function') {
            return asset.encodeDataURI();
        }

        const mime =
            fmt === 'png' ? 'image/png' :
                (fmt === 'jpg' || fmt === 'jpeg') ? 'image/jpeg' :
                    'application/octet-stream';

        return URL.createObjectURL(new Blob([asset.data], {type: mime}));
    }
};

export default TutorialHelpPageQuiz;
