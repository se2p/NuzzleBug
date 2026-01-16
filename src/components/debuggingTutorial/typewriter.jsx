import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import css from "./debuggingTutorialOverview.css";

/**
 * Animiert den Text, indem er ähnlich zu einer Schreibmaschine Buchstabe für Buchstabe des Textes ergänzt.
 */
function TypewriterText({
                            text,
                            speed = 50,
                            className = '',
                            isFinished = false,
                            onComplete = () => {}
                        }) {
    if (isFinished) return <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>;

    const [displayed, setDisplayed] = useState('');
    const hasStartedRef = useRef(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        let idx = 0;
        const timer = setInterval(() => {
            if (!isMountedRef.current) return;

            idx += 1;
            setDisplayed(text.substring(0, idx));

            if (idx >= text.length) {
                clearInterval(timer);
                if (isMountedRef.current) onComplete();
            }
        }, speed);

        return () => {
            isMountedRef.current = false;
            clearInterval(timer);
        };
    }, []);

    return (
        <span className={className} style={{ whiteSpace: 'pre-wrap' }}>
            {displayed}
        </span>
    );
}

export { TypewriterText, FitToWidth, parseColoredText };

function parseColoredText(input) {
    const result = [];
    const lines = input.split("\n");

    lines.forEach((line, lineIndex) => {
        const parts = [];
        const regex =
            /<color=(#[0-9a-fA-F]{6})>(.*?)<\/color>|<strong>(.*?)<\/strong>|<img\s+([^>]+)>/g;

        let lastIndex = 0;
        let match;

        while ((match = regex.exec(line)) !== null) {
            const [
                fullMatch,
                color,
                colorText,
                strongText,
                imgSrc
            ] = match;

            const start = match.index;

            // Text vor Match
            if (start > lastIndex) {
                parts.push(line.substring(lastIndex, start));
            }

            if (color && colorText) {
                parts.push(
                    <span
                        key={`color-${lineIndex}-${start}`}
                        style={{ color, fontWeight: "bold" }}
                    >
                        {colorText}
                    </span>
                );
            }
            else if (strongText) {
                parts.push(
                    <strong key={`strong-${lineIndex}-${start}`}>
                        {strongText}
                    </strong>
                );
            }
            else if (imgSrc) {
                parts.push(
                    <img
                        key={`img-${lineIndex}-${start}`}
                        src={tutorialIndexData[imgSrc.trim()]}
                        draggable={false}
                        className={css.textImage}
                        alt=""
                    />
                );
            }

            lastIndex = start + fullMatch.length;
        }

        // Resttext
        if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
        }

        result.push(...parts);

        if (lineIndex < lines.length - 1) {
            result.push(<br key={`br-${lineIndex}`} />);
        }
    });

    return result;
}


function FitToWidth({ children, className }) {
    const outerRef = useRef(null);
    const innerRef = useRef(null);

    const [scale, setScale] = useState(1);
    const [scaledHeight, setScaledHeight] = useState(null);

    const measure = () => {
        const outer = outerRef.current;
        const inner = innerRef.current;
        if (!outer || !inner) return;

        const outerW = outer.clientWidth;

        // offsetWidth/offsetHeight sind NICHT von transform beeinflusst → ideal zum Messen
        const innerW = inner.offsetWidth;
        const innerH = inner.offsetHeight;

        if (outerW <= 0 || innerW <= 0) return;

        const s = Math.min(1, outerW / innerW);
        setScale(s);
        setScaledHeight(innerH * s);
    };

    useLayoutEffect(() => {
        // 1) initial messen
        measure();

        // 2) nach Render-Pipeline nochmal messen (ScratchBlocks rendert teils async)
        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(measure);
            // cleanup raf2 via closure
        });

        // 3) auf Größenänderungen reagieren
        const ro = new ResizeObserver(() => measure());
        if (outerRef.current) ro.observe(outerRef.current);
        if (innerRef.current) ro.observe(innerRef.current);

        // 4) DOM-Änderungen innerhalb (ScratchBlocks kann nachträglich Nodes ändern)
        const mo = new MutationObserver(() => measure());
        if (innerRef.current) mo.observe(innerRef.current, { childList: true, subtree: true });

        return () => {
            cancelAnimationFrame(raf1);
            ro.disconnect();
            mo.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={outerRef}
            className={className}
            style={{
                // Höhe fixen, damit die Karte NICHT die unskalierte Höhe reserviert
                height: scaledHeight != null ? `${scaledHeight}px` : "auto",
                overflow: "hidden",
            }}
        >
            <div
                ref={innerRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    // wichtig: damit Breitenmessung stabil bleibt
                    display: "inline-block",
                }}
            >
                {children}
            </div>
        </div>
    );
}

