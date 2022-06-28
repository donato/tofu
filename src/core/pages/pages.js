import Armory from './armory.php';
import Attack from './attack.php';
import AttackLog from './attacklog.php';
import Base from './base.php';
import Conquest from './conquest.php';
import Detail from './detail.php';
import IntelFile from './intelfile.php';
import Mercs from './mercs.php';
import Stats from './stats.php';
import Recruit from './recruit.php';
import Training from './training.php';
import IntelDetail from './inteldetail.php';
import Battlefield from './battlefield.php';

export default {
  // Verified
  armory: Armory,
  attacklog: AttackLog,
  base: Base,
  battlefield: Battlefield,
  conquest: Conquest,
  inteldetail: IntelDetail,
  intelfile: IntelFile,
  mercs: Mercs,
  recruit: Recruit,
  stats : Stats,

  // Working, not updated
  attack: Attack,
  detail: Detail,

  // // Not verified
  training : Training,

  // // Not implemented
  // upgrades: Upgrades,
  // safe: Safe,
  // statistics: Statistics,
  // trade: Trade,
};
