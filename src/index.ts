type TrimLeft<Input extends string> = Input extends ` ${infer Rest}`
  ? TrimLeft<Rest>
  : Input;
type TrimRight<Input extends string> = Input extends `${infer Rest} `
  ? TrimRight<Rest>
  : Input;

export type Trim<Input extends string> = TrimLeft<TrimRight<Input>>;

type ParseNext<
  Input extends string,
  Separator extends string
> = Input extends `${string}${Separator}${infer Result}` ? Result : Input;

type Contents<
  Input extends string,
  Separator extends string
> = Input extends `${infer Result}${Separator}${string}` ? Result : Input;

type TokenizeInternal<
  Input extends string,
  OpeningPattern extends string,
  ClosingPattern extends string,
  Result extends ReadonlyArray<string> = []
> = Input extends ParseNext<Input, OpeningPattern>
  ? Result
  : TokenizeInternal<
      ParseNext<Input, OpeningPattern>,
      OpeningPattern,
      ClosingPattern,
      [
        ...Result,
        Trim<Contents<ParseNext<Input, OpeningPattern>, ClosingPattern>>
      ]
    >;

export type Tokenize<
  Input extends string,
  OpeningPattern extends string = "{{",
  ClosingPattern extends string = "}}"
> = TokenizeInternal<Input, OpeningPattern, ClosingPattern>;

export type SubstitionMap<Values extends ReadonlyArray<string>> = {
  [K in Values[number]]: string;
};

type TokenizeMeCapn = Tokenize<`
this has
{{ some stuff }}
with
{{values}}
{{in curly brackets }}
{{ with mixed spacing}}
`>;

type SubstitionizeMeCapn = SubstitionMap<TokenizeMeCapn>;
