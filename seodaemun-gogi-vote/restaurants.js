// 서대문역 인근 고기집 후보 데이터 (네이버 지도/플레이스, 블로그 후기 참고)
const RESTAURANTS = [
  {
    id: "hwau",
    name: "화우 서대문역본점",
    category: "한식 · 소고기구이",
    address: "서울 서대문구 통일로9안길 32",
    mapQuery: "화우 서대문역본점",
    desc: "고급스러운 분위기의 소고기구이 전문점. 갈비탕, 육회비빔밥 등 사이드 메뉴 평도 좋아 회식·모임 장소로 인기.",
    images: [
      "https://ldb-phinf.pstatic.net/20231006_292/1696557811425syeM6_JPEG/temp_file.jpg",
      "https://ldb-phinf.pstatic.net/20241011_137/1728611500816Ijm3d_JPEG/1000056111.jpg",
      "https://ldb-phinf.pstatic.net/20240730_231/1722325597359DmES7_JPEG/1722324962546.jpg",
      "https://ldb-phinf.pstatic.net/20231221_261/1703112432031Veewv_JPEG/1000042477.jpg",
      "https://ldb-phinf.pstatic.net/20231221_147/1703112556062UPNNC_JPEG/1000042488.jpg",
      "https://ldb-phinf.pstatic.net/20231221_214/170311245434663ODI_JPEG/1000042478.jpg",
      "https://ldb-phinf.pstatic.net/20231221_104/1703112737336mxFyc_JPEG/1000042474.jpg",
      "https://ldb-phinf.pstatic.net/20241011_28/1728611500829zsuDX_JPEG/1000056109.jpg",
      "https://ldb-phinf.pstatic.net/20240730_69/1722325703690ik2se_JPEG/1722324962485.jpg",
      "https://ldb-phinf.pstatic.net/20231221_227/1703112525347872ue_JPEG/1000042484.jpg",
      "https://ldb-phinf.pstatic.net/20231221_92/1703112565503VMg9z_JPEG/1000042487.jpg",
      "https://ldb-phinf.pstatic.net/20240730_140/1722336405806u5oxS_JPEG/1722324962665.jpg"
    ],
    menu: [
      { name: "양념갈비", price: "가격 문의" },
      { name: "갈비탕", price: "가격 문의" },
      { name: "육회비빔밥", price: "가격 문의" },
      { name: "런치 특선", price: "가격 문의" }
    ]
  },
  {
    id: "chungjeong",
    name: "충정화로",
    category: "한식 · 육류/고기요리",
    address: "서울 서대문구 통일로9안길 22 1층",
    mapQuery: "충정화로 서대문",
    desc: "얇게 겹겹이 쌓아 굽는 '천겹살'로 유명한 서대문역 고깃집. 독특한 비주얼과 식감으로 다이닝코드 등에서도 소개됨.",
    images: [
      "https://d12zq4w4guyljn.cloudfront.net/20251222090331537_photo_e1f803b10cac.webp",
      "https://ldb-phinf.pstatic.net/20241004_178/1728047796266wRqQl_JPEG/1000024967.jpg",
      "https://ldb-phinf.pstatic.net/20241004_68/1728047774608FefkO_JPEG/1000024966.jpg",
      "https://ldb-phinf.pstatic.net/20241004_79/1728047814997CLc1V_JPEG/1000024978.jpg",
      "https://ldb-phinf.pstatic.net/20240617_274/171860807536173Rz5_JPEG/_DSF5041.jpg",
      "https://ldb-phinf.pstatic.net/20240621_132/1718975638874ykmrb_JPEG/_DSF1292.jpg",
      "https://ldb-phinf.pstatic.net/20240617_241/1718607916829EyO15_JPEG/_DSF5074.jpg",
      "https://ldb-phinf.pstatic.net/20240617_86/1718604915853gWqgT_JPEG/_DSF4990.jpg",
      "https://ugc-images.catchtable.co.kr/shop/manager/images/87bd21a3256e4e7fbd76c41b46c458cf"
    ],
    menu: [
      { name: "천겹살", price: "가격 문의" },
      { name: "구이 모둠", price: "가격 문의" }
    ]
  },
  {
    id: "hanok",
    name: "한옥그레이스",
    category: "한식 · 육류/고기요리",
    address: "서울 서대문구 통일로9안길 28-5",
    mapQuery: "한옥그레이스 서대문",
    desc: "자개장 인테리어가 독특한 한옥 컨셉 고깃집. 저렴한 점심특선부터 숙성육, 한우까지 폭넓은 메뉴 구성.",
    images: [
      "https://d12zq4w4guyljn.cloudfront.net/750_750_20201202090523_photo1_6c01a27e92a7.jpg",
      "https://img.dmitory.com/img/202208/777/1Jt/7771Jtp1nyeKe8wUaesIQ2.jpg",
      "https://pup-post-phinf.pstatic.net/MjAyNTEyMjhfMjEg/MDAxNzY2OTMxNzYwODY1.hYQZQyl0wrL5uOjg7zneGgO8J7bZweO_xNdtsu0Fqngg.0HQghf-WF7MrTg9zF-ovBLRxp5EzdgfqFPN_mZp7ypYg.JPEG/91E87632-0D67-4A62-B954-A92E01F8D7DB.jpg",
      "https://pup-post-phinf.pstatic.net/MjAyNTEyMjhfMjM3/MDAxNzY2OTMxNzU5NjY5.h_myq8c__Pg6gLDV-oulqNb4xGf9275XUnFDwq8qHAMg.PZXQfQBucgG-Yu_NqzmvKhZRWvMIS3aVnrFPITdtoYog.JPEG/491E4852-AE82-46E8-A54B-A94E923F9A6A.jpg",
      "https://img.dmitory.com/img/202208/3el/NN9/3elNN9XAlWO6MA2MeU0cge.jpg",
      "https://pup-post-phinf.pstatic.net/MjAyNjAyMDlfMjQ1/MDAxNzcwNjM3OTgyNTg2.51_yEHqehcWxzl-2_N5eShxC20d_Ts-Y-5luBT6Mpewg.duODq2Ucx8kHub1nHmBJ5ARqC1Fm2uzy3yHpKzbjC2Qg.JPEG/POST_IMAGE_ENCODING_20260209_205300_489.jpg",
      "https://pup-post-phinf.pstatic.net/MjAyNTA5MTlfNTgg/MDAxNzU4MjQwMDU5NjMz.DmyxDoxrj0praQljkWC5rIA0fMZ6pi-zsq2QKqw5D6Ug.pZPNJBpz-Gf2jTjDCJhPnKcGVMSWLvr3sAMTKYuYfiYg.JPEG/POST_IMAGE_ENCODING_20250919_090057_663.jpg",
      "https://d12zq4w4guyljn.cloudfront.net/20251219085518066_photo_e1f803b10cac.webp",
      "https://d12zq4w4guyljn.cloudfront.net/20251219085518707_photo_e1f803b10cac.webp"
    ],
    menu: [
      { name: "숙성삼겹살", price: "19,000원" },
      { name: "숙성항정살", price: "23,000원" },
      { name: "한우 차돌박이", price: "38,000원" },
      { name: "한돈 모둠", price: "38,000원" },
      { name: "점심특선", price: "9,900원~19,000원" }
    ]
  },
  {
    id: "sikkeop",
    name: "식껍 서대문역점",
    category: "한식 · 육류/고기요리",
    address: "서울 서대문구 통일로9안길 26 1층",
    mapQuery: "식껍 서대문역점",
    desc: "삼겹살부터 등심덧살·쫀득살·오도독살 같은 특수부위, 한우 소고기세트까지 구성이 알찬 가성비 고깃집.",
    images: [
      "https://naverbooking-phinf.pstatic.net/20240613_120/1718277091976t7Vd7_JPEG/KakaoTalk_20240613_200801795.jpg",
      "https://ldb-phinf.pstatic.net/20240613_240/1718276871063NlzW9_JPEG/KakaoTalk_20240613_200303554_03.jpg",
      "https://ldb-phinf.pstatic.net/20210826_254/1629950705065NwxcU_JPEG/bOXGyh7kTo_I4vAVbil0Ex8E.jpg",
      "https://ldb-phinf.pstatic.net/20210828_67/1630137017918zF5UL_JPEG/-CG2ppMawzQP-twewxSqz5uA.jpg",
      "https://lh3.googleusercontent.com/sitesv/AA5AbUBPLohsUPSf5NnRld3LnW3agkr2BlBWjK_7zDstht2WGRWwWws0Jx7CfrQEXMyJ4WIrpu9qpu2sJ8eO9AMCOK9XfxPTJph5dUg_vziHqzj3ZRJoSFAm2NX0oREi_XBz0LgoWJFPCBtsf379GBdhOL_kCWmHMEtT1Z1BlBxYN-JaO1TFnBqWYOUgMzybWkiFsk3sSPmsGTXCLkDi23VleZv3oTEqiBarcdUVVSt1=w1280",
      "https://ldb-phinf.pstatic.net/20231027_73/1698332849305KqxRS_JPEG/34.jpg",
      "https://naverbooking-phinf.pstatic.net/20241202_81/1733110258933UKuL9_JPEG/%C6%AE%B8%AE.jpg"
    ],
    menu: [
      { name: "삼겹살", price: "가격 문의" },
      { name: "등심덧살", price: "가격 문의" },
      { name: "쫀득살", price: "가격 문의" },
      { name: "오도독살", price: "가격 문의" },
      { name: "생고기모둠", price: "가격 문의" },
      { name: "한우 소고기세트", price: "가격 문의" }
    ]
  }
];
