import Koc from 'utils/koc_utils';
class Training {
  run() {
    this.defineTables();
    // todo(): TFF Growth chart
  }

  defineTables() {
    this.$armyTable = Koc.getTableByHeading('Personnel');
  }
}

export default new Training();