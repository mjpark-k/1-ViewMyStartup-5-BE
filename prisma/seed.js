import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const company = [
  {
    name: "ybm",
    actualInvest: 200,
    description:
      "'최고'를 꿈꾸는 YBM은 이에 대응해 사이버 학원등 온라인 영어교육을 확장하고, 어학원을 유아부터 영어를 배우는 평생교육의 장으로, 영재성을 발굴하는 전문화된 교육의 장으로 키워나가고 있습니다. 또한 기술개발을 꾸준히 추진해 새로 시작되는 speaking, writing 테스트 사업을 성공적으로 정착 시켜 나가고 있습니다.",
    revenue: 10,
    employees: 100,
    image: "https://ifh.cc/g/CjSaHG.jpg",
    category: "에듀테크",
  },
  {
    name: "메가스터디",
    actualInvest: 250,
    description:
      "메가스터디교육은 최고를 향해 끊임없이 노력하고, 신뢰와 믿음으로 더불어 일하며, 혁신적 마인드로 변화를 선도하고 있습니다. 앞으로도 더 큰 미래를 향해 끊임없이 도전하겠습니다.",
    revenue: 7,
    employees: 66,
    image: "https://ifh.cc/g/BL60Zg.png",
    category: "에듀테크",
  },
  {
    name: "웅진씽크빅",
    actualInvest: 160,
    description:
      "40년의 교육 노하우를 바탕으로 지속적인 창조와 혁신, 차별화된 콘텐츠를 통해 4차산업혁명시대의 새로운 AI교육기업으로 거듭나고 있습니다.",
    revenue: 8,
    employees: 80,
    image: "https://ifh.cc/g/XxHDGn.png",
    category: "에듀테크",
  },
  {
    name: "야나두",
    actualInvest: 150,
    description:
      "우리는 수강생들을 끊임없이 자극합니다. 장학금으로 지속적인 동기부여를 하고, 1대1 슈퍼케어로 어려워하는 부분을 바로 잡아주고, 10분 강의로 날마다 새로운 호기심을 유발합니다. 그렇게 우리는 수강생들이 결국, 영어 성공이라는 목표를 이루도록 끊임없이 자극합니다.",
    revenue: 3,
    employees: 25,
    image: "https://ifh.cc/g/pXda21.png",
    category: "에듀테크",
  },
  {
    name: "크레버스",
    actualInvest: 270,
    description:
      "크레버스는 21세기가 요청하는 사회·문화적 가치를 발굴하고, 가치를 구현하기 위한 역량들로 융합 인재 양성의 길을 열어갑니다.",
    revenue: 2,
    employees: 15,
    image: "https://ifh.cc/g/pZ7XcA.png",
    category: "에듀테크",
  },
  {
    name: "해커스",
    actualInvest: 310,
    description:
      "해커스교육그룹은 교육 컨텐츠 개발 및 IT 전문분야 교육을 주요 사업으로 영위하고 있습니다. 어학, 공무원, 자격증, 취업, 커뮤니티, 교재 등 다양한 분야로 사업을 확장하고 있으며 올바른 교육의 나눔을 실현하고자 노력합니다.",
    revenue: 10,
    employees: 99,
    image: "https://ifh.cc/g/1SlDC7.png",
    category: "에듀테크",
  },
  {
    name: "GS건설",
    actualInvest: 320,
    description:
      "GS건설은 항상 고객에게 신뢰 받는 기업, 나아가 고객에게 감동을 주는 기업이 되기 위해, 전 임직원이 한마음이 되어 최고의 기술과품질을 바탕으로 고객에게 정성을 다하는 기업이 될 것을 여러분께 약속 드립니다.",
    revenue: 16,
    employees: 103,
    image: "https://ifh.cc/g/xozzqW.png",
    category: "건설업",
  },
  {
    name: "KCC건설",
    actualInvest: 350,
    description:
      "KCC건설은 글로벌 초일류 정밀화학기업의 계열사로, 경영상태와 재무구조의 견실도가 국내 대형 건설업체 중 가장 튼튼한 기업이라고 자부하고 있으며, 앞으로도 변함없이 고객 여러분께 감동을 전하고 사랑받는 기업이 되도록 전 임직원이 최선을 다할 것을 약속드립니다.",
    revenue: 15,
    employees: 55,
    image: "https://ifh.cc/g/Ms1fvN.png",
    category: "건설업",
  },
  {
    name: "삼성SDI",
    actualInvest: 400,
    description:
      "삼성SDI는 친환경 에너지와 첨단 소재를 양대 축으로 전기자동차, ESS(Energy Storage System), Power Tool, IT용 배터리 사업과 반도체, 디스플레이, 배터리용 전자재료 사업을 전개하고 있습니다.",
    revenue: 50,
    employees: 86,
    image: "https://ifh.cc/g/oaDwxq.png",
    category: "제조업",
  },
  {
    name: "KSS해운",
    actualInvest: 220,
    description:
      "회사는 1969년에 설립하여 동북아 지역에서 액화가스 및 액체 석유화학 제품의 해상운송 서비스로 사업을 개시하였습니다. 석유화학제품을 안전하게 운송하는 첨단 기술력, 화주 본위의 운항일정 및 정도 경영을 통해 모든 고객이 만족할 수 있도록 혼신 의 노력을 경주해 왔습니다.",
    revenue: 5,
    employees: 30,
    image: "https://ifh.cc/g/Bmd1fv.png",
    category: "운송업",
  },
  {
    name: "CGV",
    actualInvest: 270,
    description:
      "CGV는 영화 그 이상의 다양한 몰입의 경험을 만드는 'DEEP DIVE SPACE'로 끊임없이 진화하고 있습니다.",
    revenue: 17,
    employees: 30,
    image: "https://ifh.cc/g/B1THvp.png",
    category: "정보통신업",
  },
  {
    name: "NICE",
    actualInvest: 270,
    description:
      "신용평가를 통해 자본시장의 길잡이 역할을 하고, 다양한 데이터를 집중하여 유의미한 데이터 소스를 시장에 제공합니다. 우리가 매일 사용하는 IT기기/스마트폰의 반도체, 자동차의 핵심부품도 NICE의 기술력으로 만들어갑니다.",
    revenue: 4,
    employees: 14,
    image: "https://ifh.cc/g/FlO8FT.png",
    category: "기술서비스",
  },
];
async function main() {
  await prisma.startup.deleteMany();
  await prisma.user.deleteMany();
  await prisma.startup.createMany({
    data: company,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
