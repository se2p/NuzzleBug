import React, {useEffect, useRef, useState} from "react";
/**
 * Komponente für Nutzer-Bubbles
 */
/*const UserBubble = ({
                        text,
                        isVisible,
                        onClick,
                        onEntered,
                        onExit,
                        isSelected = false,
                        transitionDelay = '0ms',
                        timeout = 500,
                        children = null,
                    }) => {
    return (
        <CSSTransition
            in={isVisible}
            timeout={timeout}
            classNames={{
                enter: css['animatedBubble-enter'],
                enterActive: css['animatedBubble-enter-active'],
                exit: css['animatedBubble-exit'],
                exitActive: css['animatedBubble-exit-active']
            }}
            onEntered={onEntered}
            onExit={onExit}
            unmountOnExit
            appear={true}
        >
            <div
                className={`${css.helpBubble} ${isSelected ? css.selected : ''}`}
                onClick={onClick}
                style={{transitionDelay: transitionDelay}}
            >
                <div className={css.selectionBubbleIndicator} />
                <span>{text}</span>
                {children}
            </div>
        </CSSTransition>
    );
};

/**
 * Komponente für Euli-Bubbles
 */
/*const EuliBubble = ({
                        text,
                        isVisible,
                        onEntered,
                        onExit,
                        onTypewriterComplete,
                        isTypewriterFinished = false,
                        showChild,
                        typewriterSpeed = 20,
                        children = null,
                        transitionDelay = "0ms",
                        timeout = 300
                    }) => {
    const renderContent = () => {
        if (children) {
            return (
                <div>
                    <TypewriterText
                        text={text}
                        speed={typewriterSpeed}
                        onComplete={onTypewriterComplete}
                        isFinished={isTypewriterFinished}
                    />
                    {showChild && <div style={{marginTop: "5px"}}>
                        {children}
                    </div>}
                </div>
            );
        }

        return (
            <TypewriterText
                text={text}
                speed={typewriterSpeed}
                onComplete={onTypewriterComplete}
                isFinished={isTypewriterFinished}
            />
        );
    };

    return (
        <CSSTransition
            in={isVisible}
            timeout={timeout}
            classNames={{
                enter:       css['animatedBubble-enter'],
                enterActive: css['animatedBubble-enter-active'],
                exit:        css['animatedBubble-exit'],
                exitActive:  css['animatedBubble-exit-active']

            }}
            onEntered={onEntered}
            onExit={onExit}
            unmountOnExit
            appear={true}
        >
            <div className={css.helpBubbleEuli} style={{transitionDelay: transitionDelay}}>
                <img
                    className={css.helpBubbleEuliIndicator}
                    alt="Bubble-Decal"
                    src={bubbleIndicatorBlue}
                />
                {renderContent()}
            </div>
        </CSSTransition>
    );
};


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
