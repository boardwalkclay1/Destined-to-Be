import { computeLifePath } from './lifePath.js';
import { computeBirthday } from './birthday.js';
import { computeAttitude } from './attitude.js';

import { computeExpression } from './expression.js';
import { computeSoul } from './soul.js';
import { computePersonality } from './personality.js';
import { computeMaturity } from './maturity.js';

import { computeKarmicLessons } from './karmicLessons.js';
import { computeKarmicDebt } from './karmicDebt.js';

import { computeCycles } from './cycles.js';
import { computePinnacles } from './pinnacles.js';
import { computeChallenges } from './challenges.js';

import { computePersonalYear } from './personalYear.js';
import { computePersonalMonth } from './personalMonth.js';
import { computePersonalDay } from './personalDay.js';

import { computePlanes } from './planes.js';
import { computeIntensity } from './intensity.js';
import { computeShadow } from './shadow.js';

import { computeRepeating } from './repeating.js';

import { computeAddress } from './applied/address.js';
import { computeBusinessName } from './applied/businessName.js';
import { computeProjectName } from './applied/projectName.js';

export function computeAll(fullName, birthdate, applied = {}) {
  const lifePath = computeLifePath(birthdate);
  const birthday = computeBirthday(birthdate);
  const attitude = computeAttitude(birthdate);

  const expression = computeExpression(fullName);
  const soul = computeSoul(fullName);
  const personality = computePersonality(fullName);
  const maturity = computeMaturity(lifePath, expression);

  const karmicLessons = computeKarmicLessons(fullName);
  const karmicDebt = computeKarmicDebt(lifePath, birthday, expression);

  const cycles = computeCycles(birthdate);
  const pinnacles = computePinnacles(birthdate);
  const challenges = computeChallenges(birthdate);

  const personalYear = computePersonalYear(birthdate);
  const personalMonth = computePersonalMonth(personalYear);
  const personalDay = computePersonalDay(personalMonth);

  const planes = computePlanes(fullName);
  const intensity = computeIntensity(fullName);
  const shadow = computeShadow(expression);

  const repeating = computeRepeating();

  return {
    lifePath,
    birthday,
    attitude,
    expression,
    soul,
    personality,
    maturity,
    karmicLessons,
    karmicDebt,
    cycles,
    pinnacles,
    challenges,
    personalYear,
    personalMonth,
    personalDay,
    planes,
    intensity,
    shadow,
    repeating,
    applied: {
      address: computeAddress(applied.address),
      businessName: computeBusinessName(applied.businessName),
      projectName: computeProjectName(applied.projectName)
    }
  };
}
