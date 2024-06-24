/**
 * BSD 3-Clause License
 * 
 * Copyright (c) 2024, Philipp Reuter
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this 
 *    list of conditions, and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this 
 *    list of conditions, and the following disclaimer in the documentation and/or 
 *    other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may 
 *    be used to endorse or promote products derived from this software without 
 *    specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
 * OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY 
 * OF SUCH DAMAGE.
 */

/**
 * Integer Constants in JavaScript and Go
 *
 * This module provides constants for the maximum and minimum integers in both 
 * JavaScript and Go contexts. It includes safe integers for JavaScript as well 
 * as 32-bit and 64-bit integer limits for Go, represented using JavaScript's 
 * `BigInt` where necessary.
 */

/**
 * JavaScript Integer Constants
 *
 * JavaScript has a limitation on the size of integers it can safely represent 
 * using the Number type. These constants define the maximum and minimum safe 
 * integers in JavaScript.
 */

/** 
 * @constant {number} maxJsInt 
 * @description Maximum safe integer in JavaScript (9,007,199,254,740,991).
 */
export const maxJsInt = Number.MAX_SAFE_INTEGER;

/** 
 * @constant {number} minJsInt 
 * @description Minimum safe integer in JavaScript (-9,007,199,254,740,991).
 */
export const minJsInt = Number.MIN_SAFE_INTEGER;

/** 
 * @constant {BigInt} maxJsBigInt64 
 * @description Maximum 64-bit integer in JavaScript using BigInt (9,223,372,036,854,775,807).
 */
export const maxJsBigInt64 = (BigInt(1) << BigInt(63)) - BigInt(1); // 2^63 - 1

/** 
 * @constant {BigInt} minJsBigInt64 
 * @description Minimum 64-bit integer in JavaScript using BigInt (-9,223,372,036,854,775,808).
 */
export const minJsBigInt64 = -(BigInt(1) << BigInt(63)); // -2^63

/**
 * Go Integer Constants
 *
 * Go language defines specific integer size limits for 32-bit and 64-bit integers. 
 * These constants define those limits, represented in JavaScript using `BigInt` 
 * for 64-bit values.
 */

/** 
 * @constant {number} maxGo32Int 
 * @description Maximum 32-bit integer in Go (2,147,483,647).
 */
export const maxGo32Int = (1 << 31) - 1; // 2^31 - 1

/** 
 * @constant {number} minGo32Int 
 * @description Minimum 32-bit integer in Go (-2,147,483,648).
 */
export const minGo32Int = -(1 << 31); // -2^31

/** 
 * @constant {BigInt} maxGo64Int 
 * @description Maximum 64-bit integer in Go (9,223,372,036,854,775,807).
 */
export const maxGo64Int = (BigInt(1) << BigInt(63)) - BigInt(1); // 2^63 - 1

/** 
 * @constant {BigInt} minGo64Int 
 * @description Minimum 64-bit integer in Go (-9,223,372,036,854,775,808).
 */
export const minGo64Int = -(BigInt(1) << BigInt(63)); // -2^63
