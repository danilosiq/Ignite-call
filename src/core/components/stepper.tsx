import { Column, Row } from "./layout";

interface StepperProps{
    maxSteps:number
    currentStep:number
}

export function Stepper({currentStep,maxSteps}:StepperProps){

    return(
        <Column className="gap-1">
        <p className="text-gray-200 text-xs">Passo {currentStep} de {maxSteps}</p>

        <Row className="gap-2 h-[4px]">
        {Array.from({length:maxSteps}, (_,i) => i+1).map((step)=>(
            <div key={step} className={`${step <= currentStep ? 'bg-gray-100 w-full':'bg-gray-600 w-full'} rounded-sm`}/>
        ))}
        </Row>
        </Column>
    )
}