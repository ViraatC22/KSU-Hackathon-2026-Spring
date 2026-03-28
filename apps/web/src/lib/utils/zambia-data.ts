export const PROVINCES = [
  "Central",
  "Copperbelt",
  "Eastern",
  "Luapula",
  "Lusaka",
  "Muchinga",
  "Northern",
  "North-Western",
  "Southern",
  "Western",
] as const;

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  Central: ["Chibombo", "Chisamba", "Itezhi-Tezhi", "Kabwe", "Kapiri Mposhi", "Mkushi", "Mumbwa", "Ngabwe", "Serenje", "Shibuyunji"],
  Copperbelt: ["Chililabombwe", "Chingola", "Kalulushi", "Kitwe", "Luanshya", "Lufwanyama", "Masaiti", "Mpongwe", "Mufulira", "Ndola"],
  Eastern: ["Chadiza", "Chipangali", "Chipata", "Kasenengwa", "Katete", "Lundazi", "Mambwe", "Nyimba", "Petauke", "Sinda", "Vubwi"],
  Luapula: ["Chembe", "Chiengi", "Chipili", "Kawambwa", "Lunga", "Mansa", "Milenge", "Mwansabombwe", "Mwense", "Nchelenge", "Samfya"],
  Lusaka: ["Chilanga", "Chongwe", "Kafue", "Luangwa", "Lusaka", "Rufunsa"],
  Muchinga: ["Chama", "Chinsali", "Isoka", "Kanchibiya", "Lavushimanda", "Mafinga", "Mpika", "Nakonde", "Shiwang'andu"],
  Northern: ["Chilubi", "Kaputa", "Kasama", "Luwingu", "Mbala", "Mporokoso", "Mpulungu", "Mungwi", "Nsama", "Senga Hill"],
  "North-Western": ["Chavuma", "Ikelenge", "Kabompo", "Kalumbila", "Kasempa", "Manyinga", "Mufumbwe", "Mushindamo", "Mwinilunga", "Solwezi", "Zambezi"],
  Southern: ["Chikankata", "Choma", "Gwembe", "Kalomo", "Kazungula", "Livingstone", "Mazabuka", "Monze", "Namwala", "Pemba", "Siavonga", "Sinazongwe", "Zimba"],
  Western: ["Kalabo", "Kaoma", "Limulunga", "Luampa", "Lukulu", "Mongu", "Mulobezi", "Mwandi", "Nalolo", "Nkeyema", "Senanga", "Sesheke", "Shangombo", "Sikongo", "Sioma"],
};

export const ZAMBIAN_FIRST_NAMES_MALE = [
  "Bwalya", "Chanda", "Chipego", "Daliso", "Gift", "Joseph", "Kalumba",
  "Mulenga", "Mutale", "Mwamba", "Mwansa", "Nkandu", "Tembo", "Victor", "Zulu",
];

export const ZAMBIAN_FIRST_NAMES_FEMALE = [
  "Bupe", "Charity", "Chilufya", "Esther", "Grace", "Hope", "Ireen",
  "Mwila", "Natasha", "Nchimunya", "Precious", "Ruth", "Thandiwe", "Wezi",
];

export const ZAMBIAN_LAST_NAMES = [
  "Banda", "Bwalya", "Chanda", "Chisanga", "Daka", "Kabwe", "Kalumba",
  "Lungu", "Moyo", "Mubanga", "Mulenga", "Mumba", "Musonda", "Mwale",
  "Mwansa", "Nkandu", "Phiri", "Sakala", "Tembo", "Zulu",
];

export function generateNRC(): string {
  const num1 = String(Math.floor(Math.random() * 999999)).padStart(6, "0");
  const num2 = String(Math.floor(Math.random() * 99)).padStart(2, "0");
  const num3 = String(Math.floor(Math.random() * 9) + 1);
  return `${num1}/${num2}/${num3}`;
}

export function generatePhone(platform: "MTN_MONEY" | "AIRTEL_MONEY" | "ZOONA"): string {
  const prefixes = { MTN_MONEY: "097", AIRTEL_MONEY: "096", ZOONA: "095" };
  const suffix = String(Math.floor(Math.random() * 9999999)).padStart(7, "0");
  return `+260${prefixes[platform]}${suffix}`;
}

export function formatZMW(amount: number): string {
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getAllDistricts(): string[] {
  return Object.values(DISTRICTS_BY_PROVINCE).flat();
}

export function getProvinceForDistrict(district: string): string | undefined {
  for (const [province, districts] of Object.entries(DISTRICTS_BY_PROVINCE)) {
    if (districts.includes(district)) return province;
  }
  return undefined;
}
