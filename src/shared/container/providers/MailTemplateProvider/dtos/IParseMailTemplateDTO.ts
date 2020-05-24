interface ITemplateVariables {
  [key: string]: string | number | boolean | object;
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
