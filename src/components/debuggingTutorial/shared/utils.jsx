import React, {useLayoutEffect, useRef, useState} from "react";
import css from "../pages/tutorial-overview/debuggingTutorialOverview.css";

export { FitToWidth, parseColoredText };

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
        const innerW = inner.offsetWidth;
        const innerH = inner.offsetHeight;

        if (outerW <= 0 || innerW <= 0) return;

        const s = Math.min(1, outerW / innerW);
        setScale(s);
        setScaledHeight(innerH * s);
    };

    useLayoutEffect(() => {
        measure();
        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(measure);
        });

        const ro = new ResizeObserver(() => measure());
        if (outerRef.current) ro.observe(outerRef.current);
        if (innerRef.current) ro.observe(innerRef.current);

        const mo = new MutationObserver(() => measure());
        if (innerRef.current) mo.observe(innerRef.current, { childList: true, subtree: true });

        return () => {
            cancelAnimationFrame(raf1);
            ro.disconnect();
            mo.disconnect();
        };
    }, []);

    return (
        <div
            ref={outerRef}
            className={className}
            style={{
                height: scaledHeight != null ? `${scaledHeight}px` : "auto",
                overflow: "hidden",
            }}
        >
            <div
                ref={innerRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    display: "inline-block",
                }}
            >
                {children}
            </div>
        </div>
    );
}

