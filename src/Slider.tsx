import { h, FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import styled, { css } from "styled-components";
import { WSJFScore } from "./WSJF";

interface SliderItemProps {
    isActive: boolean
}

interface SliderRowProps<T> {
    title: string,
    options: T[],
    isActive: boolean,
    onNewValue: (newValue: T) => void
}

const SliderItem = styled.div<SliderItemProps>`
    ${(props: SliderItemProps) => css`
        background: ${props.isActive ? "red" : "blue"};
        opacity: ${props.isActive ? "1" : "0.25"};
        padding: 10px;
        border: 2px solid;
        border-radius: 5px;
        font-weight: ${props.isActive ? "400" : "100"};
        text-align: center;
    `}
`;

const SliderContainerTitleElement = styled.h3``;

const SliderRowElement = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
`;

const SliderContainerElement = styled.div<{isActive: boolean}>`
    ${(props) => (
        css`
            opacity: ${props.isActive ? "0.9" : "0.6"};
            padding: 15px;
        `
    )}
`;

const SliderRow: FunctionalComponent<SliderRowProps<WSJFScore>> = ({ title, options, isActive, onNewValue }) => {
    const currentXPosition = useSlider({numItems: options.length, nextKey: "ArrowRight", prevKey: "ArrowLeft", isActive })
    useEffect(() => {
        onNewValue(options[currentXPosition]);
    }, [currentXPosition])
    return (
        <SliderContainerElement isActive={ isActive }>
            <SliderContainerTitleElement>{ title }</SliderContainerTitleElement>
            <SliderRowElement>
            { options.map((item, i) => {
                return (
                <SliderItem isActive={ currentXPosition === i }>{ item.toString() }</SliderItem>
                )
            })}
            </SliderRowElement>
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

export {
    useSlider,
    IUseSlider,
    SliderRow,
    SliderRowProps,
    ArrowKey
}