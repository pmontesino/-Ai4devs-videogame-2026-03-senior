import DataProcessingPurpose from "../shared/data-processing-purpose.model.js";

export default class PurposeDisclosure {
  static formatPurposes(rawPurposes) {
    return rawPurposes
      .map((item) => new DataProcessingPurpose(item))
      .filter((item) => item.isValid())
      .map((item) => {
        const essential = item.essential_flag ? "Esencial" : "No esencial";
        return `${item.name} (${essential}) - Base juridica: ${item.legal_basis}`;
      })
      .join(" | ");
  }
}
