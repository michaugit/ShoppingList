export default class UnitService {

  static getUnits(): string[]{
    return ['COUNT', 'KG', 'DAG', 'G']
  }

  static getDefaultUnit(): string {
    return 'COUNT'
  }

}
