/* V813 — Fantasy Jersey Library: Celtic reference + 50 transparent jersey PNGs.
   Additive only: does not replace Fantasy logic. */
(function(){
'use strict';
if(window.__LJR_V813_FANTASY_JERSEY_LIBRARY__)return;
window.__LJR_V813_FANTASY_JERSEY_LIBRARY__=true;

const KEY='v813-fantasy-jersey-skin';
const CATALOG=[
  {
    "id": "celtic-mint-2025-26",
    "club": "Celtic",
    "season": "2025/26",
    "type": "Training",
    "label": "Celtic 2025/26 Mint Training",
    "url": "https://store.celticfc.com/cdn/shop/files/adidas-celtic-2025-26-mint-green-training-jersey-1180888359.jpg?v=1753297691&width=1946",
    "source": "https://store.celticfc.com/products/adidas-celtic-2025-26-mint-green-training-jersey",
    "removeBg": true
  },
  {
    "id": "kit-1-aston-villa-home-2015",
    "club": "Aston Villa",
    "season": "2015",
    "type": "Home",
    "label": "Aston Villa 2015 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/aston-villa-home-kit-2015.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/aston-villa-home-kit-2015.png",
    "removeBg": false
  },
  {
    "id": "kit-2-barnsley-home-1997",
    "club": "Barnsley",
    "season": "1997",
    "type": "Home",
    "label": "Barnsley 1997 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/barnsley-home-kit-1997.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/barnsley-home-kit-1997.png",
    "removeBg": false
  },
  {
    "id": "kit-3-birmingham-city-home-2010",
    "club": "Birmingham City",
    "season": "2010",
    "type": "Home",
    "label": "Birmingham City 2010 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/birmingham-city-home-kit-2010.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/birmingham-city-home-kit-2010.png",
    "removeBg": false
  },
  {
    "id": "kit-4-blackburn-rovers-home-2011",
    "club": "Blackburn Rovers",
    "season": "2011",
    "type": "Home",
    "label": "Blackburn Rovers 2011 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/blackburn-rovers-home-kit-2011.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/blackburn-rovers-home-kit-2011.png",
    "removeBg": false
  },
  {
    "id": "kit-5-blackpool-home-2010",
    "club": "Blackpool",
    "season": "2010",
    "type": "Home",
    "label": "Blackpool 2010 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/blackpool-home-kit-2010.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/blackpool-home-kit-2010.png",
    "removeBg": false
  },
  {
    "id": "kit-6-bolton-wanderers-home-2011",
    "club": "Bolton Wanderers",
    "season": "2011",
    "type": "Home",
    "label": "Bolton Wanderers 2011 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/bolton-wanderers-home-kit-2011.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/bolton-wanderers-home-kit-2011.png",
    "removeBg": false
  },
  {
    "id": "kit-7-bournemouth-home-2017",
    "club": "Bournemouth",
    "season": "2017",
    "type": "Home",
    "label": "Bournemouth 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/bournemouth-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/bournemouth-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-8-bradford-city-home-2000",
    "club": "Bradford City",
    "season": "2000",
    "type": "Home",
    "label": "Bradford City 2000 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/bradford-city-home-kit-2000.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/bradford-city-home-kit-2000.png",
    "removeBg": false
  },
  {
    "id": "kit-9-brighton-and-hove-albion-home-2017",
    "club": "Brighton & Hove Albion",
    "season": "2017",
    "type": "Home",
    "label": "Brighton & Hove Albion 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/brighton-and-hove-albion-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/brighton-and-hove-albion-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-10-burnley-home-2017",
    "club": "Burnley",
    "season": "2017",
    "type": "Home",
    "label": "Burnley 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/burnley-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/burnley-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-11-cardiff-city-home-2013",
    "club": "Cardiff City",
    "season": "2013",
    "type": "Home",
    "label": "Cardiff City 2013 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/cardiff-city-home-kit-2013.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/cardiff-city-home-kit-2013.png",
    "removeBg": false
  },
  {
    "id": "kit-12-charlton-athletic-home-2006",
    "club": "Charlton Athletic",
    "season": "2006",
    "type": "Home",
    "label": "Charlton Athletic 2006 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/charlton-athletic-home-kit-2006.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/charlton-athletic-home-kit-2006.png",
    "removeBg": false
  },
  {
    "id": "kit-13-chelsea-home-2017",
    "club": "Chelsea",
    "season": "2017",
    "type": "Home",
    "label": "Chelsea 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/chelsea-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/chelsea-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-14-coventry-city-home-2000",
    "club": "Coventry City",
    "season": "2000",
    "type": "Home",
    "label": "Coventry City 2000 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/coventry-city-home-kit-2000.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/coventry-city-home-kit-2000.png",
    "removeBg": false
  },
  {
    "id": "kit-15-derby-county-home-2007",
    "club": "Derby County",
    "season": "2007",
    "type": "Home",
    "label": "Derby County 2007 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/derby-county-home-kit-2007.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/derby-county-home-kit-2007.png",
    "removeBg": false
  },
  {
    "id": "kit-16-everton-home-2017",
    "club": "Everton",
    "season": "2017",
    "type": "Home",
    "label": "Everton 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/everton-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/everton-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-17-fulham-home-2013",
    "club": "Fulham",
    "season": "2013",
    "type": "Home",
    "label": "Fulham 2013 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/fulham-home-kit-2013.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/fulham-home-kit-2013.png",
    "removeBg": false
  },
  {
    "id": "kit-18-huddersfield-town-home-2017",
    "club": "Huddersfield Town",
    "season": "2017",
    "type": "Home",
    "label": "Huddersfield Town 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/huddersfield-town-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/huddersfield-town-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-19-hull-city-home-2016",
    "club": "Hull City",
    "season": "2016",
    "type": "Home",
    "label": "Hull City 2016 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/hull-city-home-kit-2016.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/hull-city-home-kit-2016.png",
    "removeBg": false
  },
  {
    "id": "kit-20-ipswich-town-home-2001",
    "club": "Ipswich Town",
    "season": "2001",
    "type": "Home",
    "label": "Ipswich Town 2001 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/ipswich-town-home-kit-2001.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/ipswich-town-home-kit-2001.png",
    "removeBg": false
  },
  {
    "id": "kit-21-leeds-united-home-2003",
    "club": "Leeds United",
    "season": "2003",
    "type": "Home",
    "label": "Leeds United 2003 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/leeds-united-home-kit-2003.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/leeds-united-home-kit-2003.png",
    "removeBg": false
  },
  {
    "id": "kit-22-leicester-city-home-2017",
    "club": "Leicester City",
    "season": "2017",
    "type": "Home",
    "label": "Leicester City 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/leicester-city-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/leicester-city-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-23-liverpool-home-2017",
    "club": "Liverpool",
    "season": "2017",
    "type": "Home",
    "label": "Liverpool 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/liverpool-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/liverpool-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-24-manchester-city-home-2017",
    "club": "Manchester City",
    "season": "2017",
    "type": "Home",
    "label": "Manchester City 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/manchester-city-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/manchester-city-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-25-manchester-united-home-2017",
    "club": "Manchester United",
    "season": "2017",
    "type": "Home",
    "label": "Manchester United 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/manchester-united-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/manchester-united-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-26-middlesbrough-home-2016",
    "club": "Middlesbrough",
    "season": "2016",
    "type": "Home",
    "label": "Middlesbrough 2016 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/middlesbrough-home-kit-2016.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/middlesbrough-home-kit-2016.png",
    "removeBg": false
  },
  {
    "id": "kit-27-newcastle-united-home-2017",
    "club": "Newcastle United",
    "season": "2017",
    "type": "Home",
    "label": "Newcastle United 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/newcastle-united-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/newcastle-united-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-28-norwich-city-home-2015",
    "club": "Norwich City",
    "season": "2015",
    "type": "Home",
    "label": "Norwich City 2015 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/norwich-city-home-kit-2015.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/norwich-city-home-kit-2015.png",
    "removeBg": false
  },
  {
    "id": "kit-29-nottingham-forest-home-1998",
    "club": "Nottingham Forest",
    "season": "1998",
    "type": "Home",
    "label": "Nottingham Forest 1998 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/nottingham-forest-home-kit-1998.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/nottingham-forest-home-kit-1998.png",
    "removeBg": false
  },
  {
    "id": "kit-30-oldham-athletic-home-1993",
    "club": "Oldham Athletic",
    "season": "1993",
    "type": "Home",
    "label": "Oldham Athletic 1993 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/oldham-athletic-home-kit-1993.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/oldham-athletic-home-kit-1993.png",
    "removeBg": false
  },
  {
    "id": "kit-31-portsmouth-home-2009",
    "club": "Portsmouth",
    "season": "2009",
    "type": "Home",
    "label": "Portsmouth 2009 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/portsmouth-home-kit-2009.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/portsmouth-home-kit-2009.png",
    "removeBg": false
  },
  {
    "id": "kit-32-queens-park-rangers-home-2014",
    "club": "Queens Park Rangers",
    "season": "2014",
    "type": "Home",
    "label": "Queens Park Rangers 2014 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/queens-park-rangers-home-kit-2014.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/queens-park-rangers-home-kit-2014.png",
    "removeBg": false
  },
  {
    "id": "kit-33-reading-home-2012",
    "club": "Reading",
    "season": "2012",
    "type": "Home",
    "label": "Reading 2012 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/reading-home-kit-2012.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/reading-home-kit-2012.png",
    "removeBg": false
  },
  {
    "id": "kit-34-sheffield-united-home-2006",
    "club": "Sheffield United",
    "season": "2006",
    "type": "Home",
    "label": "Sheffield United 2006 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/sheffield-united-home-kit-2006.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/sheffield-united-home-kit-2006.png",
    "removeBg": false
  },
  {
    "id": "kit-35-sheffield-wednesday-home-1999",
    "club": "Sheffield Wednesday",
    "season": "1999",
    "type": "Home",
    "label": "Sheffield Wednesday 1999 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/sheffield-wednesday-home-kit-1999.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/sheffield-wednesday-home-kit-1999.png",
    "removeBg": false
  },
  {
    "id": "kit-36-southampton-home-2017",
    "club": "Southampton",
    "season": "2017",
    "type": "Home",
    "label": "Southampton 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/southampton-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/southampton-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-37-stoke-city-home-2017",
    "club": "Stoke City",
    "season": "2017",
    "type": "Home",
    "label": "Stoke City 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/stoke-city-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/stoke-city-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-38-sunderland-home-2016",
    "club": "Sunderland",
    "season": "2016",
    "type": "Home",
    "label": "Sunderland 2016 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/sunderland-home-kit-2016.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/sunderland-home-kit-2016.png",
    "removeBg": false
  },
  {
    "id": "kit-39-swansea-city-home-2017",
    "club": "Swansea City",
    "season": "2017",
    "type": "Home",
    "label": "Swansea City 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/swansea-city-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/swansea-city-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-40-swindon-town-home-1993",
    "club": "Swindon Town",
    "season": "1993",
    "type": "Home",
    "label": "Swindon Town 1993 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/swindon-town-home-kit-1993.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/swindon-town-home-kit-1993.png",
    "removeBg": false
  },
  {
    "id": "kit-41-watford-home-2017",
    "club": "Watford",
    "season": "2017",
    "type": "Home",
    "label": "Watford 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/watford-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/watford-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-42-west-bromwich-albion-home-2017",
    "club": "West Bromwich Albion",
    "season": "2017",
    "type": "Home",
    "label": "West Bromwich Albion 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/west-bromwich-albion-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/west-bromwich-albion-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-43-west-ham-united-home-2017",
    "club": "West Ham United",
    "season": "2017",
    "type": "Home",
    "label": "West Ham United 2017 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/west-ham-united-home-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/west-ham-united-home-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-44-wigan-athletic-home-2012",
    "club": "Wigan Athletic",
    "season": "2012",
    "type": "Home",
    "label": "Wigan Athletic 2012 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/wigan-athletic-home-kit-2012.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/wigan-athletic-home-kit-2012.png",
    "removeBg": false
  },
  {
    "id": "kit-45-wimbledon-home-1999",
    "club": "Wimbledon",
    "season": "1999",
    "type": "Home",
    "label": "Wimbledon 1999 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/wimbledon-home-kit-1999.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/wimbledon-home-kit-1999.png",
    "removeBg": false
  },
  {
    "id": "kit-46-wolverhampton-wanderers-home-2011",
    "club": "Wolverhampton Wanderers",
    "season": "2011",
    "type": "Home",
    "label": "Wolverhampton Wanderers 2011 Home",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/wolverhampton-wanderers-home-kit-2011.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/wolverhampton-wanderers-home-kit-2011.png",
    "removeBg": false
  },
  {
    "id": "kit-47-chelsea-away-2017",
    "club": "Chelsea",
    "season": "2017",
    "type": "Away",
    "label": "Chelsea 2017 Away",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/chelsea-away-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/chelsea-away-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-48-liverpool-away-2017",
    "club": "Liverpool",
    "season": "2017",
    "type": "Away",
    "label": "Liverpool 2017 Away",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/liverpool-away-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/liverpool-away-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-49-manchester-city-away-2017",
    "club": "Manchester City",
    "season": "2017",
    "type": "Away",
    "label": "Manchester City 2017 Away",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/manchester-city-away-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/manchester-city-away-kit-2017.png",
    "removeBg": false
  },
  {
    "id": "kit-50-manchester-united-away-2017",
    "club": "Manchester United",
    "season": "2017",
    "type": "Away",
    "label": "Manchester United 2017 Away",
    "url": "https://raw.githubusercontent.com/lukehedger/kit-pics/main/kits-source/manchester-united-away-kit-2017.png",
    "source": "https://github.com/lukehedger/kit-pics/blob/main/kits-source/manchester-united-away-kit-2017.png",
    "removeBg": false
  }
];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
let processed=new Map(),layer=null;

function chosen(){const id=localStorage.getItem(KEY)||'';return CATALOG.find(x=>x.id===id)||null}
function close(){layer?.remove();layer=null;document.body.classList.remove('v813-jersey-picker-open')}
function toast(msg){
  document.querySelector('.v813-toast')?.remove();
  const d=document.createElement('div');d.className='v813-toast';d.textContent=msg;document.body.appendChild(d);
  requestAnimationFrame(()=>d.classList.add('show'));setTimeout(()=>d.remove(),1800);
}
function stripLightBackground(url){
  if(processed.has(url))return processed.get(url);
  const promise=new Promise(resolve=>{
    const im=new Image();im.crossOrigin='anonymous';
    im.onload=()=>{
      try{
        const c=document.createElement('canvas');c.width=im.naturalWidth||1200;c.height=im.naturalHeight||1200;
        const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,c.width,c.height);
        const data=x.getImageData(0,0,c.width,c.height),d=data.data;
        const corner=[[4,4],[c.width-5,4],[4,c.height-5],[c.width-5,c.height-5]];
        let br=0,bg=0,bb=0;corner.forEach(([px,py])=>{const j=(py*c.width+px)*4;br+=d[j];bg+=d[j+1];bb+=d[j+2]});
        br/=4;bg/=4;bb/=4;
        for(let i=0;i<d.length;i+=4){
          const r=d[i],g=d[i+1],b=d[i+2];
          const dist=Math.hypot(r-br,g-bg,b-bb);
          const neutral=Math.max(r,g,b)-Math.min(r,g,b)<18;
          if(dist<34&&neutral)d[i+3]=0;
          else if(dist<58&&neutral)d[i+3]=Math.min(d[i+3],Math.round(255*(dist-34)/24));
        }
        x.putImageData(data,0,0);resolve(c.toDataURL('image/png'));
      }catch(_){resolve(url)}
    };
    im.onerror=()=>resolve(url);im.src=url;
  });
  processed.set(url,promise);return promise;
}
async function sourceFor(item){return item?.removeBg?await stripLightBackground(item.url):item?.url||''}

async function apply(){
  const item=chosen();
  if(!item){document.body.classList.remove('v813-custom-jersey');document.documentElement.style.removeProperty('--v813-jersey-src');return}
  const src=await sourceFor(item);
  if(!src)return;
  document.documentElement.style.setProperty('--v813-jersey-src','url("'+String(src).replace(/"/g,'%22')+'")');
  document.body.classList.add('v813-custom-jersey');
  document.body.dataset.v813Jersey=item.id;
  document.querySelectorAll('[data-v813-jersey-label]').forEach(n=>n.textContent=item.club+' · '+item.type);
}
function select(id){
  const item=CATALOG.find(x=>x.id===id);if(!item)return;
  localStorage.setItem(KEY,id);apply();close();toast('Jersey aplicado: '+item.club);
}
function card(item){
  const on=chosen()?.id===item.id?' selected':'';
  return '<button type="button" class="v813-jersey-card'+on+'" data-v813-pick="'+esc(item.id)+'">'+
   '<span class="v813-jersey-art"><img src="'+esc(item.url)+'" '+(item.removeBg?'data-v813-bgstrip="'+esc(item.id)+'" ':'')+'alt="'+esc(item.label)+'" loading="lazy"></span>'+
   '<b>'+esc(item.club)+'</b><small>'+esc(item.season)+' · '+esc(item.type)+'</small></button>';
}
function open(){
  close();layer=document.createElement('div');layer.className='v813-jersey-layer';document.body.classList.add('v813-jersey-picker-open');
  layer.innerHTML='<button type="button" class="v813-backdrop" data-v813-close aria-label="Cerrar"></button>'+
    '<section class="v813-sheet"><header><div><small>FANTASY</small><h2>Jerseys 3D</h2><p>51 diseños · PNG sin fondo o recorte automático · vista diagonal</p></div><button type="button" data-v813-close aria-label="Cerrar">×</button></header>'+
    '<label class="v813-search"><span>⌕</span><input type="search" data-v813-search placeholder="Buscar club o temporada"></label>'+
    '<div class="v813-grid" data-v813-grid>'+CATALOG.map(card).join('')+'</div></section>';
  document.body.appendChild(layer);
  layer.querySelectorAll('[data-v813-bgstrip]').forEach(async img=>{
    const item=CATALOG.find(x=>x.id===img.dataset.v813Bgstrip);
    const src=await sourceFor(item);
    if(src&&img.isConnected)img.src=src;
  });
  layer.querySelectorAll('[data-v813-close]').forEach(b=>b.onclick=close);
  layer.querySelectorAll('[data-v813-pick]').forEach(b=>b.onclick=()=>select(b.dataset.v813Pick));
  const inp=layer.querySelector('[data-v813-search]');inp.oninput=()=>{
    const q=inp.value.toLowerCase().trim();
    layer.querySelector('[data-v813-grid]').innerHTML=CATALOG.filter(x=>!q||(x.club+' '+x.season+' '+x.type).toLowerCase().includes(q)).map(card).join('');
    layer.querySelectorAll('[data-v813-pick]').forEach(b=>b.onclick=()=>select(b.dataset.v813Pick));
  };
}
function inject(){
  if(route()!=='fantasyTeam')return;
  const head=document.querySelector('.v576-builder-head');if(!head||head.querySelector('[data-v813-open]'))return;
  const btn=document.createElement('button');btn.type='button';btn.className='v813-open';btn.dataset.v813Open='';btn.setAttribute('aria-label','Abrir jerseys 3D');
  btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4 4 6 2 10l4 2v8h12v-8l4-2-2-4-4-2c-.6 1.7-1.9 2.5-4 2.5S8.6 5.7 8 4Z"/></svg><span data-v813-jersey-label>Jerseys</span>';
  btn.onclick=open;head.appendChild(btn);apply();
}
function sync(){apply();inject()}
const mo=new MutationObserver(()=>requestAnimationFrame(inject));
function boot(){sync();mo.observe(document.body,{childList:true,subtree:true});window.addEventListener('hashchange',()=>setTimeout(sync,0));}
window.LJR_FANTASY_JERSEYS={catalog:CATALOG,open,select,chosen,apply};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();