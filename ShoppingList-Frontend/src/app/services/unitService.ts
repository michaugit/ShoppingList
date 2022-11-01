export default class UnitService {

  static getUnits(): string[]{
    return ['count', 'kg', 'dag', 'g']
  }

  static getDefaultUnit(): string {
    return 'count'
  }

}
