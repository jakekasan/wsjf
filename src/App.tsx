import { h, FunctionComponent } from "preact";
import { useMemo } from "preact/hooks";
import { WSJFScore, useWSJF, formatWsjf } from "./WSJF";
import { useSlider, SliderRow } from "./Slider";
import { CopyToClipBoard } from "./Clipboard";


const App: FunctionComponent = () => {

    const currentYPosition = useSlider({ numItems:4, nextKey: "ArrowDown", prevKey: "ArrowUp" })
    const WSJFScores = [1, 2, 3, 5, 8, 13, 21] as WSJFScore[];
    
    const {
        setOperationalBenefit,
        setTimeCriticality,
        setRiskReduction,
        setTimeToFix,
        operationalBenefit,
        timeCriticality,
        riskReduction,
        timeToFix,
        finalScore,
        costOfDelay,
    } = useWSJF();
    
    const value = useMemo(() => {
        return formatWsjf(operationalBenefit, timeCriticality, riskReduction, costOfDelay, timeToFix, finalScore);
    }, [finalScore, costOfDelay, operationalBenefit, timeCriticality, riskReduction, timeToFix])

    return (
        <div>
            <h3>Weighted Shortest Job First</h3>
            <div>
                <SliderRow title="Operational Benefit" options={ WSJFScores } isActive={ currentYPosition === 0} onNewValue={ setOperationalBenefit }/>
                <SliderRow title="Time Criticality" options={ WSJFScores } isActive={ currentYPosition === 1} onNewValue={ setTimeCriticality }/>
                <SliderRow title="Risk Reduction" options={ WSJFScores } isActive={ currentYPosition === 2} onNewValue={ setRiskReduction }/>
                <h3>Cost of Delay: {costOfDelay}</h3>
                <SliderRow title="Time to Fix" options={ WSJFScores } isActive={ currentYPosition === 3} onNewValue={ setTimeToFix }/>
                <h3>Final Score: {finalScore}</h3>
            </div>
            <CopyToClipBoard content={ value }/>
        </div>
    )
}

export default App;
