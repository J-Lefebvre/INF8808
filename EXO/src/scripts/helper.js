
/**
 * @param {number} nSteps The ideal number of steps
 * @param {*} domain Domain of d3 scale
 * @returns {number} The best step to use
 */
export function getClosestStep (nSteps, domain) {
  const BEST_STEPS = [
    0.1, 0.2, 0.25, 0.5,
    1, 2, 2.5, 5,
    10, 20, 25, 50,
    100, 200, 250, 500,
    1000, 2000, 2500, 5000,
    10000, 20000, 25000, 50000
  ]
  var step = (domain[1] - domain[0]) / nSteps
  var stepDiff = []
  var bestStep = BEST_STEPS[BEST_STEPS.length - 1]
  for (let i = 0; i < BEST_STEPS.length; i++) {
    stepDiff.push(Math.abs(BEST_STEPS[i] - step))
    if (i > 0 && stepDiff[i] > stepDiff[i - 1]) {
      bestStep = BEST_STEPS[i - 1]
      break
    }
  }
  return bestStep
}

/**
 * @param {number} nSteps The ideal number of steps
 * @param {*} domain Domain of d3 scale
 * @returns {Array<number>} The best steps
 */
export function getSteps (nSteps, domain) {
  var step = getClosestStep(nSteps, domain)
  var steps = []
  if (domain[0] <= 0 && domain[1] >= 0) {
    steps.push(0)
  } else {
    steps.push(domain[0])
  }
  while (steps[steps.length - 1] < domain[1] - step) {
    steps.push(steps[steps.length - 1] + step)
  }
  while (steps[0] > domain[0] + step) {
    steps.unshift(steps[0] - step)
  }
  return steps
}
