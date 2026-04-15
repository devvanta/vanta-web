export type City = {
  slug: string;
  name: string;
  state: string;
};

export const cities: City[] = [
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", state: "RJ" },
  { slug: "sao-paulo", name: "São Paulo", state: "SP" },
  { slug: "belo-horizonte", name: "Belo Horizonte", state: "MG" },
  { slug: "florianopolis", name: "Florianópolis", state: "SC" },
  { slug: "curitiba", name: "Curitiba", state: "PR" },
  { slug: "porto-alegre", name: "Porto Alegre", state: "RS" },
  { slug: "salvador", name: "Salvador", state: "BA" },
  { slug: "recife", name: "Recife", state: "PE" },
];
