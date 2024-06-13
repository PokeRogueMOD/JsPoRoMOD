import i18next from "i18next";
import { MoneyFormat } from "./enums/money-format";

export const MissingTextureKey = "__MISSING";

export function toReadableString(str) {
  return str.replace(/_/g, " ").split(" ").map(s => `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`).join(" ");
}

export function randomString(length, seeded = false) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = seeded ? randSeedInt(characters.length) : Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

export function shiftCharCodes(str, shiftCount = 0) {
  return Array.from(str).map(char => String.fromCharCode(char.charCodeAt(0) + shiftCount)).join("");
}

export function clampInt(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randGauss(stdev, mean = 0) {
  if (!stdev) return 0;
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

export function randSeedGauss(stdev, mean = 0) {
  if (!stdev) return 0;
  const u = 1 - Phaser.Math.RND.realInRange(0, 1);
  const v = Phaser.Math.RND.realInRange(0, 1);
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

export function padInt(value, length, padWith = "0") {
  return value.toString().padStart(length, padWith);
}

export function randInt(range, min = 0) {
  return Math.floor(Math.random() * range) + min;
}

export function randSeedInt(range, min = 0) {
  return Phaser.Math.RND.integerInRange(min, range - 1 + min);
}

export function randIntRange(min, max) {
  return randInt(max - min, min);
}

export function randItem(items) {
  return items.length === 1 ? items[0] : items[randInt(items.length)];
}

export function randSeedItem(items) {
  return items.length === 1 ? items[0] : Phaser.Math.RND.pick(items);
}

export function randSeedWeightedItem(items) {
  return items.length === 1 ? items[0] : Phaser.Math.RND.weightedPick(items);
}

export function randSeedEasedWeightedItem(items, easingFunction = "Sine.easeIn") {
  if (!items.length) return null;
  if (items.length === 1) return items[0];
  const value = Phaser.Math.RND.realInRange(0, 1);
  const easedValue = Phaser.Tweens.Builders.GetEaseFunction(easingFunction)(value);
  return items[Math.floor(easedValue * items.length)];
}

export function randSeedShuffle(items) {
  if (items.length <= 1) return items;
  const newArray = items.slice();
  for (let i = items.length - 1; i > 0; i--) {
    const j = Phaser.Math.RND.integerInRange(0, i);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getFrameMs(frameCount) {
  return Math.floor((1 / 60) * 1000 * frameCount);
}

export function getCurrentTime() {
  const date = new Date();
  return (((date.getHours() * 60 + date.getMinutes()) / 1440) + 0.675) % 1;
}

const secondsInHour = 3600;

export function getPlayTimeString(totalSeconds) {
  const days = Math.floor(totalSeconds / (secondsInHour * 24)).toString().padStart(2, "0");
  const hours = Math.floor(totalSeconds % (secondsInHour * 24) / secondsInHour).toString().padStart(2, "0");
  const minutes = Math.floor(totalSeconds % secondsInHour / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");

  return `${days}:${hours}:${minutes}:${seconds}`;
}

export function binToDec(input) {
  return input.split("").reverse().reduce((acc, curr, i) => acc + parseInt(curr) * Math.pow(2, i), 0);
}

export function decToBin(input) {
  return input.toString(2);
}

export function getIvsFromId(id) {
  const bin = decToBin(id).padStart(30, '0');
  return [
    binToDec(bin.slice(0, 5)),
    binToDec(bin.slice(5, 10)),
    binToDec(bin.slice(10, 15)),
    binToDec(bin.slice(15, 20)),
    binToDec(bin.slice(20, 25)),
    binToDec(bin.slice(25, 30))
  ];
}

export function formatLargeNumber(count, threshold) {
  if (count < threshold) return count.toString();
  const units = ["", "K", "M", "B", "T", "q"];
  const exponent = Math.floor((count.toString().length - 1) / 3);
  const scaledCount = (count / Math.pow(1000, exponent)).toFixed(2).replace(/\.0+$/, "");
  return `${scaledCount}${units[exponent]}`;
}

const AbbreviationsLargeNumber = ["", "K", "M", "B", "t", "q", "Q", "s", "S", "o", "n", "d"];

export function formatFancyLargeNumber(number, rounded = 3) {
  if (number < 1000) return number.toString();
  const exponent = Math.min(Math.floor(Math.log(number) / Math.log(1000)), AbbreviationsLargeNumber.length - 1);
  number /= Math.pow(1000, exponent);
  return `${(number % 1 === 0 ? number : number.toFixed(rounded))}${AbbreviationsLargeNumber[exponent]}`;
}

export function formatMoney(format, amount) {
  return format === MoneyFormat.ABBREVIATED ? formatFancyLargeNumber(amount) : amount.toLocaleString();
}

export function formatStat(stat, forHp = false) {
  return formatLargeNumber(stat, forHp ? 100000 : 1000000);
}

export function getEnumKeys(enumType) {
  return Object.values(enumType).filter(v => isNaN(parseInt(v.toString()))).map(v => v.toString());
}

export function getEnumValues(enumType) {
  return Object.values(enumType).filter(v => !isNaN(parseInt(v.toString()))).map(v => parseInt(v.toString()));
}

export function executeIf(condition, promiseFunc) {
  return condition ? promiseFunc() : Promise.resolve(null);
}

export const sessionIdKey = "pokerogue_sessionId";
export const isLocal = (
  (window.location.hostname === "localhost" ||
   /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(window.location.hostname)) &&
  window.location.port !== "") || window.location.hostname === "";

export const localServerUrl = import.meta.env.VITE_SERVER_URL ?? `http://${window.location.hostname}:${window.location.port + 1}`;
export const serverUrl = isLocal ? localServerUrl : "";
export const apiUrl = isLocal ? serverUrl : "https://api.pokerogue.net";
export let isLocalServerConnected = true;

export function setCookie(cName, cValue) {
  const expiration = new Date();
  expiration.setTime(new Date().getTime() + 3600000 * 24 * 30 * 3);
  document.cookie = `${cName}=${cValue};Secure;SameSite=Strict;Path=/;Expires=${expiration.toUTCString()}`;
}

export function getCookie(cName) {
  const name = `${cName}=`;
  const ca = document.cookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function localPing() {
  if (isLocal) {
    apiFetch("game/titlestats")
      .then(() => isLocalServerConnected = true)
      .catch(() => isLocalServerConnected = false);
  }
}

export function apiFetch(path, authed = false) {
  if ((isLocal && isLocalServerConnected) || !isLocal) {
    const request = {};
    if (authed) {
      const sId = getCookie(sessionIdKey);
      if (sId) {
        request.headers = { "Authorization": sId };
      }
    }
    return fetch(`${apiUrl}/${path}`, request);
  }
  return new Promise(() => {});
}

export function apiPost(path, data, contentType = "application/json", authed = false) {
  if ((isLocal && isLocalServerConnected) || !isLocal) {
    const headers = {
      "Accept": contentType,
      "Content-Type": contentType,
    };
    if (authed) {
      const sId = getCookie(sessionIdKey);
      if (sId) {
        headers["Authorization"] = sId;
      }
    }
    return fetch(`${apiUrl}/${path}`, { method: "POST", headers, body: data });
  }
  return new Promise(() => {});
}

export class BooleanHolder {
  constructor(value) {
    this.value = value;
  }
}

export class NumberHolder {
  constructor(value) {
    this.value = value;
  }
}

export class IntegerHolder extends NumberHolder {}

export class FixedInt extends IntegerHolder {}

export function fixedInt(value) {
  return new FixedInt(value);
}

export function rgbToHsv(r, g, b) {
  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);
  const h = c && ((v === r) ? (g - b) / c : ((v === g) ? 2 + (b - r) / c : 4 + (r - g) / c));
  return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
}

export function deltaRgb(rgb1, rgb2) {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  const drp2 = Math.pow(r1 - r2, 2);
  const dgp2 = Math.pow(g1 - g2, 2);
  const dbp2 = Math.pow(b1 - b2, 2);
  const t = (r1 + r2) / 2;

  return Math.ceil(Math.sqrt(2 * drp2 + 4 * dgp2 + 3 * dbp2 + t * (drp2 - dbp2) / 256));
}

export function rgbHexToRgba(hex) {
  const color = hex.match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return {
    r: parseInt(color[1], 16),
    g: parseInt(color[2], 16),
    b: parseInt(color[3], 16),
    a: 255
  };
}

export function rgbaToInt(rgba) {
  return (rgba[0] << 24) + (rgba[1] << 16) + (rgba[2] << 8) + rgba[3];
}

export function verifyLang(lang = i18next.resolvedLanguage) {
  return ["es", "fr", "de", "it", "zh_CN", "zh_TW", "pt_BR", "ko"].includes(lang);
}

export function printContainerList(container) {
  console.log(container.list.map(go => ({ type: go.type, name: go.name })));
}

export function truncateString(str, maxLength = 10) {
  return str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;
}

export function deepCopy(values) {
  return JSON.parse(JSON.stringify(values));
}

export function reverseValueToKeySetting(input) {
  return input.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("_");
}
