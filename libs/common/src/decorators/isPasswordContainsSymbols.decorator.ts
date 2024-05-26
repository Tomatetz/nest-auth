import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordContainsSymbols', async: false })
export class IsPasswordContainsSymbols implements ValidatorConstraintInterface {
  validate(password: string) {
    const regex = /(?=.*\d)(?=.*[^\d\s])/;
    return regex.test(password);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Password should contain at least 1 symbol and 1 number';
  }
}
