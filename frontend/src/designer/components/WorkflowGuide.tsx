const steps = ['Choose template', 'Add page', 'Place components', 'Edit properties', 'Preview', 'Generate PDF'];

type WorkflowGuideProps = { activeStep?: number };

export function WorkflowGuide({ activeStep = 2 }: WorkflowGuideProps) {
  return (
    <nav className="workflow-guide" aria-label="Primary document workflow">
      {steps.map((step, index) => (
        <div key={step} className={`workflow-step ${index <= activeStep ? 'workflow-step-active' : ''}`}>
          <span className="workflow-index">{index + 1}</span>
          <span>{step}</span>
        </div>
      ))}
    </nav>
  );
}
