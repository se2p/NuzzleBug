import React, {useEffect, useRef, useState} from "react";

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

export { TypewriterText };
