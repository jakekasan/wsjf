import { h, FunctionalComponent } from "preact"
import { useEffect, useState } from "preact/hooks"

import styled, { css } from "styled-components";


type WSJFScore = 1 | 2 | 3 | 5 | 8 | 13 | 21;

interface SliderItemProps {
    // value: string,
    isActive: boolean
}

interface SliderRowProps {
    title: string,
    options: WSJFScore[],
    isActive: boolean,
    onNewValue: (newValue: WSJFScore) => void
}

const SliderItem = styled.div<SliderItemProps>`
    ${props => css`
        background: ${props.isActive ? "red" : "blue"}
    `}
`;

const SliderContainerElement = styled.div<{isActive: boolean}>`
    ${(props) => (
        css`
            background: ${props.isActive ? "yellow" : "white"}
        `
    )}
`;

const SliderRow: FunctionalComponent<SliderRowProps> = ({ title, options, isActive, onNewValue }) => {
    const currentXPosition = useSlider({numItems: options.length, nextKey: "ArrowRight", prevKey: "ArrowLeft", isActive })
    useEffect(() => {
        onNewValue(options[currentXPosition]);
    }, [currentXPosition])
    return (
        <SliderContainerElement isActive={ isActive }>
            <h3>{ title }</h3>
            <div className={`slider-row ${isActive ? "active" : ""}`}>
            { options.map((item, i) => {
                return (
                <SliderItem isActive={ currentXPosition === i }>{ item.toString() }</SliderItem>
                )
            })}
            </div>
        </SliderContainerElement>
    )
}

type ArrowKey = "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown"

interface IUseSlider {
    numItems: number,
    startingPosition?: number
    nextKey: ArrowKey,
    prevKey: ArrowKey,
    isActive?: boolean
}

const useSlider = ({ numItems, startingPosition = 0, nextKey, prevKey, isActive = true }: IUseSlider): number => {
    const [position, setPosition] = useState(startingPosition);
    if (numItems < 1) throw new Error("`numItems` must be greater than 0");
    
    useEffect(() => {
        let callback: (event: KeyboardEvent) => void = event => {
            if (!isActive) {
                console.log("Not active")
                return
            }
            switch (event.key) {
                case nextKey:
                    if (position < numItems - 1) {
                        setPosition(position + 1);
                    }
                    return
                case prevKey:
                    if (position > 0) {
                        setPosition(position - 1);
                    }
                    return
                default:
                    return
            }
        }
        addEventListener("keyup", callback);
        return () => removeEventListener("keyup", callback)
    }, [position, isActive])

    return position
}

const useWSJF = () => {
    const [operationalBenefit, setOperationalBenefit] = useState(1);
    const [timeCriticality, setTimeCriticality] = useState(1);
    const [riskReduction, setRiskReduction] = useState(1);
    const [timeToFix, setTimeToFix] = useState(1);
    
    const [costOfDelay, setCostOfDelay] = useState(operationalBenefit + timeCriticality + riskReduction);
    const [finalScore, setFinalScore] = useState(costOfDelay / timeToFix);

    useEffect(() => {
        setCostOfDelay(operationalBenefit + timeCriticality + riskReduction);
    }, [operationalBenefit, timeCriticality, riskReduction])
    
    useEffect(() => {
        setFinalScore(costOfDelay / timeToFix)
    }, [costOfDelay, timeToFix])

    return {
        finalScore,
        costOfDelay,
        setOperationalBenefit,
        setTimeCriticality,
        setRiskReduction,
        setTimeToFix
    }
}

const WSJF: FunctionalComponent = () => {

    const currentYPosition = useSlider({ numItems:4, nextKey: "ArrowDown", prevKey: "ArrowUp" })
    const WSJFScores = [1, 2, 3, 5, 8, 13, 21] as WSJFScore[];
    
    const {
        setOperationalBenefit,
        setTimeCriticality,
        setRiskReduction,
        setTimeToFix,
        finalScore,
        costOfDelay
    } = useWSJF();

    return (
        <div>
            <h3>Hello, there...</h3>
            <div>
                <SliderRow title="Operational Benefit" options={ WSJFScores } isActive={ currentYPosition === 0} onNewValue={ setOperationalBenefit }/>
                <SliderRow title="Time Criticality" options={ WSJFScores } isActive={ currentYPosition === 1} onNewValue={ setTimeCriticality }/>
                <SliderRow title="Risk Reduction" options={ WSJFScores } isActive={ currentYPosition === 2} onNewValue={ setRiskReduction }/>
                <h3>Cost of Delay: {costOfDelay}</h3>
                <SliderRow title="Time to Fix" options={ WSJFScores } isActive={ currentYPosition === 3} onNewValue={ setTimeToFix }/>
                <h3>Final Score: {finalScore}</h3>
            </div>
        </div>
    )
}

export {
    WSJF
}
