/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FareOptions {
  hasStopover: boolean;
  dist1?: number; // 거리 1 (경유지 전)
  dist2?: number; // 거리 2 (경유지 후)
  isUpward: boolean; // 상행선 여부
}

/**
 * km당 단가 및 경유지, 지역 할증 로직을 계산합니다.
 * 
 * @param distance 총 이동 거리 (km)
 * @param options 계산 옵션 (경유지 여부, 상행선 여부 등)
 * @returns 계산된 요금 (KRW)
 */
export const calculateFare = (distance: number, options: FareOptions): number => {
  let fare = 0;

  if (options.hasStopover) {
    // 경유지가 있는 경우: (구간1 * 1200) + (구간2 * 1000) + 10,000(경유비)
    const d1 = options.dist1 || 0;
    const d2 = options.dist2 || 0;
    fare = (d1 * 1200) + (d2 * 1000) + 10000;
  } else {
    // 경유지가 없는 경우: 100km 미만은 1200원, 이상은 1000원
    fare = distance < 100 ? distance * 1200 : distance * 1000;
  }

  // 상행선 할증: 30,000원 추가
  if (options.isUpward) {
    fare += 30000;
  }

  // 최소 요금 20,000원 보장
  return Math.max(fare, 20000);
};
