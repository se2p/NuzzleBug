import css from "./tutorial-step/debuggingTutorialStep.css"
import owl2 from "./images/owlTransparent.png"
import bubbleIndicatorBlue from "./images/bubbleIDecalBlue2.png"

/**
 * Renders the final message, after finishing a tutorial.
 */
export const renderFinalStep = (tutorialMessages) => {
    return (
        <div className={css.cpContainer}>
            <span className={css.finalTitle}>Glückwunsch!</span>
            <div className={css.whiteBox}>
                <div className={css.bubbleContainer}>
                    <div className={css.testStartBubble} style={{borderColor:"#4D97FFFF"}}>
                        <img className={css.finalBubbleIndicator} alt={"Bubble-Decal"} src={bubbleIndicatorBlue}/>
                        {tutorialMessages.successMsg}
                    </div>
                    <img src={owl2} alt={"Picture of Euli"} className={css.owlImage} draggable={false}/>
                </div>
            </div>
            <div className={css.backToMenuButton} onClick={() => {onBackToTutorialSelection();}}>Weiter</div>
        </div>
    );
}
