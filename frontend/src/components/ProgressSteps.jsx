const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="checkout-progress">
      <div className={`progress-step ${step1 ? "is-active" : ""}`}>
        <span className="progress-dot">{step1 ? "✓" : "1"}</span><small>Login</small>
      </div>

      {step2 && (
        <>
          <div className={`progress-line ${step1 ? "is-active" : ""}`}></div>
          <div className={`progress-step ${step2 ? "is-active" : ""}`}>
            <span className="progress-dot">{step2 ? "✓" : "2"}</span><small>Shipping</small>
          </div>
        </>
      )}

      <>
        <div className={`progress-line ${step2 && step3 ? "is-active" : ""}`}></div>
        <div className={`progress-step ${step3 ? "is-active" : ""}`}>
          <span className="progress-dot">{step3 ? "✓" : "3"}</span><small>Summary</small>
        </div>
      </>
    </div>
  );
};

export default ProgressSteps;
