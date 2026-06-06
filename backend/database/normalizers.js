/**
 * Normalize certification IDs to match the PostgreSQL enum format.
 *
 * @param {string} certificationId - Example: clf-c02
 * @returns {string} Example: CLF-C02
 */
export function normalizeCertificationId(certificationId) {
  if (typeof certificationId !== 'string') {
    return certificationId;
  }

  return certificationId.trim().toUpperCase();
}
