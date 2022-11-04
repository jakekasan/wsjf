import { h, FunctionalComponent } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"

type WSJFScore = 1 | 2 | 3 | 5 | 8 | 13 | 21;

const useWSJF = () => {
    const [operationalBenefit, setOperationalBenefit] = useState(1 as WSJFScore);
    const [timeCriticality, setTimeCriticality] = useState(1 as WSJFScore);
    const [riskReduction, setRiskReduction] = useState(1 as WSJFScore);
    const [timeToFix, setTimeToFix] = useState(1 as WSJFScore);
    
    const [costOfDelay, setCostOfDelay] = useState(operationalBenefit + timeCriticality + riskReduction);
    const [finalScore, setFinalScore] = useState(costOfDelay / timeToFix);

    useEffect(() => {
        setCostOfDelay(operationalBenefit + timeCriticality + riskReduction);
    }, [operationalBenefit, timeCriticality, riskReduction])
    
    useEffect(() => {
        setFinalScore(costOfDelay / timeToFix)
    }, [costOfDelay, timeToFix])

    return {
        operationalBenefit,
        timeCriticality,
        riskReduction,
        timeToFix,
        costOfDelay,
        finalScore,
        setOperationalBenefit,
        setTimeCriticality,
        setRiskReduction,
        setTimeToFix
    }
}

const formatWsjf = (
    operationalBenefit: WSJFScore,
    timeCriticality: WSJFScore,
    riskReduction: WSJFScore,
    costOfDelay: number,
    timeToFix: WSJFScore,
    finalScore: number
    ): string => {
    return (
        `Value: ${finalScore}\n` +
        `- Operational Benefit (OB): ${operationalBenefit}\n` +
        `- Time Criticality (TC): ${timeCriticality}\n` +
        `- Risk Reduction (RR): ${riskReduction}\n` +
        `- Cost of Delay (CoD): ${costOfDelay}\n` +
        `- Time to Fix (TtF): ${timeToFix}\n`
    )
}

export {
    WSJFScore,
    formatWsjf,
    useWSJF
}
