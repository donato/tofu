function income(tff) {
  const safeIncome = 1440 * tff * 2 * SAFE_PERCENTAGE;
  const bankIncome = AVG_AMOUNT_BANKED_DAILY * 1440 * tff * INCOME_PER_TROOP;
  return Math.floor(safeIncome + bankIncome);
}

function day(tff, growth, hits, avgLoss) {
  const newTff =  Math.floor((tff + growth) * Math.pow(1- avgLoss, hits));
  const goldIncome = income((tff + newTff)/2);
  return {
    newTff,
    goldIncome
  };
}

const nfObject = new Intl.NumberFormat('en-US')
const AVG_HOSTAGE_LOSS = 0.0015;
const AVG_HITS_PER_DAY = 0;
const AVG_AMOUNT_BANKED_DAILY = 0.7;
const SAFE_PERCENTAGE = 0.25;
const INCOME_PER_TROOP = 0.7;
// const INCOME_PER_TROOP = 2.5;
// const MASS_ATTACKS = 60;
const MASS_ATTACKS = 0;
const MASS_FREQUENCY = 7;
const STARTING_TFF = 100
const TOTAL_DAYS = 30;

function runModel(spmLevel) {
  let tff = STARTING_TFF;
  let totalIncome = 0;
  let d;
  for (d = 1; d <= TOTAL_DAYS; d++) {
    let {newTff, goldIncome} = day(tff, 25000 + 1440*spmLevel, AVG_HITS_PER_DAY, AVG_HOSTAGE_LOSS);
    if (d % MASS_FREQUENCY == 0) {
      let o = day(tff, 25000 + 1440 * spmLevel, MASS_FREQUENCY + AVG_HITS_PER_DAY, AVG_HOSTAGE_LOSS);
      newTff = o.newTff;
      goldIncome = o.goldIncome;
    }
    tff = newTff;
    totalIncome += goldIncome;
  }
  console.log(spmLevel + "\t" + TOTAL_DAYS + "\t" +  nfObject.format(tff) + "\t" + nfObject.format(totalIncome));
}

function runTest() {
  console.log("Assuming starting tff is: " + STARTING_TFF);
  console.log("Assuming avg amount banked daily is: " + AVG_AMOUNT_BANKED_DAILY);
  console.log("Assuming Safe percentage is: " + SAFE_PERCENTAGE);
  console.log("Assuming Income per troop: " + INCOME_PER_TROOP);
  console.log("Assuming avg hits per day is: " + AVG_HITS_PER_DAY);
  console.log("Assuming avg hostage loss is: " + AVG_HOSTAGE_LOSS);
  console.log("Assuming Massed every x days: " + MASS_FREQUENCY);
  console.log("Assuming Massed with x attacks: " + MASS_ATTACKS);
  console.log("SPM \t DAY #\t TFF\t TOTAL INCOME");
    // runModel(50);
  for (let i = 40; i <= 50; i++) {
    runModel(i);
  }
}
runTest();
