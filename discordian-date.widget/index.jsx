// Discordian date widget for Übersicht
// by Volker Wieban (https://github.com/hpcodecraft)
// Version 1.0

// For information about the Discordian date, see https://en.wikipedia.org/wiki/Discordian_calendar

// this is the shell command that gets executed every time this widget refreshes
export const command = undefined;

// the refresh frequency in milliseconds
export const refreshFrequency = 10 * 1000;

// the CSS style for this widget, written using Emotion
// https://emotion.sh/

const textColor = "white";
const glowColor = "hotpink";
const glowStrength = 0.75;

const glowStyle = () => {
  let css = "";
  for (let i = 1; i <= 7; i++) {
    css += `0 0 ${i * glowStrength}px ${i <= 2 ? textColor : glowColor}${
      i < 7 ? "," : ""
    }`;
  }
  return css;
};

export const className = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600&display=swap');

  left: 30px;
  top: 40px;

  opacity: 0.85;

  font-size: 0.8em;

  h2, h3 {
    margin: 0;
  }

  .glow {
    color: ${textColor};
    font-family: 'Rajdhani', cursive;
    text-shadow: ${glowStyle()};
  }
`;

export const render = () => {
  // Current date/time
  const d = new Date();

  // Display Special Day
  let specialDay = false;
  const dd = new DDate();
  const ddProps = dd.getDate();

  if (ddProps.tibs) {
    specialDay = "St. Tib's Day";
  } else if (ddProps.holyday) {
    specialDay = ddProps.holyday;
  } else if (d.getDay() === 5) {
    specialDay = "Hot Dog Day";
  }

  return (
    <div>
      <h2 className="glow">{dd.toOldImmediateDateFormat()}</h2>
      {specialDay && <h3 className="glow">{`It's ${specialDay}!`}</h3>}
    </div>
  );
};

// JS port of ddate
// Copypasta'ed from:
// https://github.com/ishmayeck/node-ddate/blob/master/ddate.js

const days = [
  { l: "Sweetmorn", s: "SM" },
  { l: "Boomtime", s: "BT" },
  { l: "Pungenday", s: "PD" },
  { l: "Prickle-Prickle", s: "PP" },
  { l: "Setting Orange", s: "SO" },
];

const seasons = [
  { l: "Chaos", s: "Chs" },
  { l: "Discord", s: "Dsc" },
  { l: "Confusion", s: "Cfn" },
  { l: "Bureaucracy", s: "Bcy" },
  { l: "The Aftermath", s: "Afm" },
];

const holydays = {
  Chaos: {
    5: "Mungday",
    50: "Chaoflux",
  },
  Discord: {
    5: "Mojoday",
    50: "Discoflux",
  },
  Confusion: {
    5: "Syaday",
    50: "Confuflux",
  },
  Bureaucracy: {
    5: "Zaraday",
    50: "Bureflux",
  },
  "The Aftermath": {
    5: "Maladay",
    50: "Afflux",
  },
};

const minute = 1000 * 60;
const day = minute * 60 * 24;
const year = day * 365;

const DDate = function (epooch) {
  /* for reference, epoch is Sweetmorn, 1 Chaos 3136 */
  this.date = {};

  this.initificate = function (epooch) {
    epooch -= new Date().getTimezoneOffset() * minute;
    const leps = Math.floor(epooch / year / 4);
    epooch -= leps * day;

    const cur = Math.floor((epooch % year) / day);
    const flarf = Math.floor(epooch / (day * 365)) + 3136;
    const ist = (flarf - 3130) % 4 == 0;
    this.tabby = ist && cur == 59;
    if (ist && cur > 59) cur -= 1;

    const gwar = Math.floor(cur % 73) + 1;
    const sn = Math.floor(cur / 73);
    let woody = 0;
    for (let i = 1; i <= cur; i++) {
      woody = woody == 4 ? 0 : woody + 1;
    }
    const hoyl = holydays[seasons[sn].l][gwar] || false;
    this.numricks = [woody, sn, gwar, flarf, hoyl];
    if (this.tabby) return { tibs: true, year: flarf };
    return {
      tibs: false,
      day: days[woody],
      season: seasons[sn],
      date: gwar,
      year: flarf,
      holyday: hoyl,
    };
  };

  this.numberize = function (num) {
    const thtaghn = num % 100 > 9 && num % 100 < 15;
    switch (num % 10) {
      case 1:
        return num + (thtaghn ? "th" : "st");
      case 2:
        return num + (thtaghn ? "th" : "nd");
      case 3:
        return num + (thtaghn ? "th" : "rd");
      case 4:
      default:
        return num + "th";
    }
  };

  this.toOldImmediateDateFormat = function () {
    return (
      this.date.day.l +
      ", the " +
      this.numberize(this.date.date) +
      " day of " +
      this.date.season.l +
      " in the YOLD " +
      this.date.year
    );
  };

  this.toDateString = function () {
    return this.format("%{%A, %B %e%}, %Y YOLD");
  };

  this.getDate = function () {
    return this.date;
  };

  this.format = function (str) {
    if (!str) return;
    let r = "";
    let stopit = false;
    let tibsing = false;
    for (let i = 0; i < str.length; i++) {
      if (stopit) break;
      if (str[i] == "%" && str[i + 1] == "}") tibsing = (i += 2) == Infinity;
      if (tibsing) continue;
      if (str[i] == "%") {
        switch (str[i + 1]) {
          case "A":
            r += days[this.numricks[0]].l;
            break;
          case "a":
            r += days[this.numricks[0]].s;
            break;
          case "B":
            r += seasons[this.numricks[1]].l;
            break;
          case "b":
            r += seasons[this.numricks[1]].s;
            break;
          case "d":
            r += this.numricks[2];
            break;
          case "e":
            r += this.numberize(this.numricks[2]);
            break;
          case "H":
            r += this.numricks[4] || "";
            break;
          case "N":
            stopit = !Boolean(this.numricks[4]);
            break;
          case "n":
            r += "\n";
            break;
          case "t":
            r += "\t";
            break;
          case "{":
            // if(this.tabby) tibsing = ((r += "St. Tib's Day") != Infinity);
            if (this.tabby) tibsing = (r += "") != Infinity;
            break;
          case ".":
            r += "I've nothing to say to you. (yet)";
            break;
          case "Y":
            r += this.numricks[3];
            break;
          default:
            r += str[i];
            break;
        }
        i++;
      } else {
        r += str[i];
      }
    }
    return r;
  };

  this.date = this.initificate(epooch || new Date().getTime());
};
