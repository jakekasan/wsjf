import { FunctionalComponent } from "preact"

const CopyToClipBoard: FunctionalComponent<{content: string}> = ({content}) => {
    const onClick = () => {
        navigator.clipboard.writeText(content)
        .then(() => console.log("Wrote some stuff!!"))
        .catch(e => console.log("Eh?", { e }))
    }

    return <button onClick={ onClick }>Click Me!</button>
}

export {
    CopyToClipBoard
}