/* V482 — credencial roja oficial hard override.
   El logo de la Liga conserva su diseño original; únicamente
   el fondo negro exterior se vuelve transparente. */
(function(){
'use strict';
if(window.__LJR_V480_CREDENTIAL__)return;
window.__LJR_V480_CREDENTIAL__=true;

const BUILD='20261001-v484-user-logo-direct';
const LEAGUE_LOGO='data:image/png;base64,S0lwpYISyKFxJKiZgWr1K1qSTVaG6GMxvM84zkOpXKFilOT2apUqLgOruNitBZOpUKhVJKyVnbVWGe3uELbr7LxpQgaeTHA7OwsDz74IDfeeCOnnnpqnRv7gPcBfby8atu2iUQijI+PMz8/zx133MHVV19NR0eHNzExYUspb9FafwWYNca8aGRkhKamJjzPo62tTbe0tMgHH3xQ1jaExVrP77cAu4FvSykTnZ2dzvj4uNZa7wf9TeDfQoHAR5Xn/b8NS5Z4F65dYctCls/dcI8UwpLpaIzLNp3EskCQ23buwyhjarnU39HV5cL+Q978PSaglVKfKRQKJ9VyBpI115yu5RlEHiPg8kfVDq5cLtfB56dZNgLbH1JKwuEw8Xgcz/PYtWsXt9xyCzfeeCMPPPAAruuybNkybrjhBt7ylrfwkY98pJ5C2lja1Vj10gjsSCRCIpHgyJEjTE1N0d7eLmZnZ3Fd9++AbwA/MMZ8I5/PPyefz4cApqamwn19vWZoaNAcPHhI2JZ1xPW8C4BSMBj8uuM4K/v7+1UoFJJjY2NSSpnQWgcBTykzrI2BcIiFhXmeubqbAyMD3LxzmP7OND3BEs0rEqxY+xw+fvUNVi0M/8PHqEL/o+HQfwXw7ne/W37yk5+Me55nCyGM4zhRpVSsIS8ZQLiu29rgv9Za62ZjTKJaIoNo0DNBa91V2yk/+uLUnCDGqNprfmUhg6m5tTprk24BmG+YYKVaJY1NtWC2KITIK6Uucxzn5Y7jKNu2rUYxGF/TIhAIIKVkdHSUu+++m/vvv5/777/fBx1btmzhox/9KBs3b2ZwcJAbbriBl7/85dx///189atfpaurqy5PcLxKcj8Hw38ukUiQyWTwPM9qbm42U1NTJwYCgdWu6+6gWhndEwwGo8aYsOd5Xz56dOTEwcEBBgb69OHDR1YBLwsGgwue572ss7PTi8fjcteuXVYgENjmuu4XfMvqae+aoBDv27p9R3Rta8BcvK5V/PnZq+nt7UPEm3AqOWxZJlPO6fHJCQk8WPsM/5eRvycd0Dag3vOe92geKQmiBpb64ZdH1bKajnNU3Uau+2RFNH+DQP9xPBSWZRml1MvL5TK2bdeLd32Nin379nHHHXdw6NAhpqamCIfDrF69mle96lVceOGFrFmz5hi1Udd1ufDCC9m2bRsveclLOPXUU/nWt77FGWecQaVSwbKsusZH42gUrvGrw/P5PC0tLWpqasr2PO+KWk4EwGjD9X6JlPL2w4eH25YtWyKi0YgplcofdhwnEo1GTV9fn7Vjxw6UUvlIJPIOYIOUshmwXdc91QjjlJWKelLjaYekZbG8u52v3HYvm9vX0pZIcODwtFaeJy0hfqqMUX+sdINFH/x4yj2PlajEE3zt7ypB5bGSplh09izL2q2U8nK5nB2JRMhms4yOjnLw4EHy+TwAqVSKNWvWcOWVV3LGGWewYsUKurq66t6JRqktP4W0r6+P2267jTe84Q2cc+65fOzf/52//du/JRaL1qOJjdZ58ah+lgy2bctoNEKxWHqxZVm3gj4P6BFC3IWmSWn9Wq11Cwh6u7tlPpenWCy1NDc3Mzg4yN69e33l/WCxWLy6lmJavwSRaJy+jm4SXQOUdIFgIMhUocS+Q0c5mllNdzpey50HYVnzeH+UOD5u6Ns8DnB+n4c4DnhZlLL6mEdXV9eR4eHhw4VCYVkymdSzs7PSz2det24dK1euZNmyZfT09NDS0kIgEGB2dhYhBC0tLYTD4Ucl/PugFkLwqU99itNO28Tr//r13HXXXXz605+mtS1FLp99BMABm3AoQCQUIhKO1FJAI4RCYbKZjGxJt1IqjSxRSv2k4fJf7v+0ZsUynnv+hew9eICJySna2trM4MAg+/bvE9ls1s8tCTY3NwdDoZAWQhjXdUw0ElcG5NGRo/LHW7W1+lnrCIsKMhgAY7ju3r0sGViCZ6x6GIs/8sP+AwdsYy+R4wJ3YIDw1FSkFdftUsZ0CWN6tTFLtDF9GrqGh4c7gZ5axymZSqXo7Oykq6uLtra2qn+6plvhc+BoNFp33TVGAxeD2hiD53q88pV/zrp1q7n8z17J6WecyWe/8En6OoYo5fMEghaBUJxAKEMoIghHbKLhKIVwiXg8xfzcBB2dHRwdMUQiEf2Cizfr7tY4d94/zPxCkec+Y7N18rq14hd33cedd9/Fuc86l507dorRsVHC4TDlcpmNGzdijNHz8/MUi0Xp61SPVybsUqkq+/FQZsHc0J0WLz2tn4DJg7B4YO8hPvLtm3RtUkjjeff/gRmzP1hAH48a+FZBP95FXLOG4OHD0bRw3VajdZ8SYolWqlcbBjRm6fAwXVBqPa5HJlD1A3uOg+d6vgxXXXEol8sRDofrrjrfbdeouB+JRB77SwkBEoolh5NPPo17tt3DX7z6tZx/7vN4z7vfxzPPfQZ5R5MvGSKlGMVQESGyeMolYFuEgi5CV5ifn+HkkzZw9ul98uy1Wg41Gy7csJGJ+RaMbOKOhx7m5gfuJ93RydiREYwxJJNJ9u3bxymnnML8/LzZs2ePv4yUqSpIZajqZtwppawYo//le1sf9Hr6W6xQNCpqaeNy7759fprwd1Q1yPYbaGY8tQG9uGOTTwuOC9izz8a+555oGy4dCK9Xad2vjVmitB4yxnTt2kUHFNuAxHF2fITDIVLhCOlI2HSEI7onFDHdwSBdVpC00qJXIq4q5uVnd+8kl83WG/Uslr5d3ILNP/vSB48HaqPm2HnPT3HyE3zkH5/JsvZRfvC1D5C0XkR37wCFiVF0OUdEg+UcIRXP0NPaRGJFP/lMkuGJAslkiqbwAmiHWCzOzP4M08Uwn/72D9m7dz+BQIDmVAqJoLevl+3bt9PX14fjOHrPnj1SCHG3lPKttm0fDofDmWXLluW3bdvm+hFNEM3lcun//e+3f2462tOOMSoIfM+yrE8AQil18+9hP/QHDejG/njH+N9aWloSXj7fVhGiD6UGtTGD2ph+pXXfbbeZISh2AvFHv6MkGAqQiERpicXojMd1X1NCd8YS9IZDDNkh0YkUKYGIeY5IVhwrVioh83kozuOVC9jFIrJ9kK9F48zOzbFs2fJqPvCi5piLO7767YzL5XJdvfN4XhXLspgePcD+e6+hIzHOhCrzty8e4uUXnkqmNMJDD97Pvn0LxNMhYuEwa/sFXZ1NVIoKYWyiyW5+ef8k1/5oG2tXn0yqqYnxmRwm2smd9x5k7979WoC0bRuNJByLcPDgQQB6e3vNtm3bhBBiwRhzqVJq3Ne1q6WOSuoFuOYNAqxcPv+6XD4fBI4C71RK7fwD3Tv9XgHdWFfYGwgEzgI2KqVWa617Zmdnu6hqaTyq244dDNAcb6It2URHOqW6UynTl0wxGG8WPeEILUEjktISaYRIKSPDbkXiOFAsQqkMpQKUK2jHxXguqlJBeSWMW8KoajLScl3ilK5OfnFgP5YwCAmlUhE3lqj3GWnsTtXYxtgXXvQ9HtWgjAJbYEmDp8pEw1GsaBdWwiE/k+MXd87hUJUM9lSFTae009JkoyolQuEQwjY40RAVx8YzDl3tCUJxi4kJh9H+ZrS2mXeS/PLO240UQmpjjBBC9Pb2MHz4EAsLC/T29lKpVFS5XLaFEJ8GGmv6jkfpMPB3wSCfVMoaVErdR1Xoxubxex/+yQHaB3NISvmXWut/cV23ufHZeCxOOpWkq6VF97V16N7WNvpbW+hOJ0V3U0J0haIiHQiKCNoKuBXssgvlMpSK4DpQrkC5gqk46EoZ7TngOhjXQ6ARlgBLIBTYUmKEhUFiTBBtWbRkFnh2bw+/OAC5bIZUPEahWMJxKjjOo/tvNzab9/uu2HagFixyAUFhYZ4De25GFXdQnB3Dyc1xcKqAAvJKIHQEQ4nmlgRdXWESAYGbK1J082QLQZxKhB0Pj9GcjtLW1MyJy3q57vrtHJlazqbNW/j8F3+gxyZmpBDiZqA7GAyu6unu0g/teFDWXI1mdHTUApxgMPi5mvij9ytAKR2HvaD2NtBDj6fQ8WR0waIWMv+B1vosIQRnnrbJu+DMZ9Df2Sn62tpFaywuWhNRmoMhGdZIXAWOB06pCtpyCV0uopwK2qngVhxwKxjXQXjV2kJLiGoHLFmr90PWK1Uw5pHEfwzGCAQWRnhIDIFchQs8w8daWxgdm2TVimVMZyYoVcqUy5VjrLIPZn8Ui8W6la7mdVhIKdCeh60DOEXNxNiDNMfCLMwbQhFo6bLxKuB5Nq5yySxkmHcrIFxCkSi2lWDP8ByxZJxgyCVoFzjvtD46+/o49ZwX8sH3f0IPHxmXUso7tNYXA9c7jrNqz549xvM8n9PrmZkZCdxRqVQO8MQ04zSPFvrhaUAfuwFUlmWdb9v2WW1trZXNp20K/r9X/4W9afVqgtKq5iwXi1AqoUsl3HIFHAdTqUC5gHFKWK6H8bxqG2NTAw2BWhWKW99TCuFXo4j6udo0SDSUEYpa7yBJTSIfbQwrZ6Y4r6ODq2dmcbUiFAlSKOZJlOOUy2WKxSKxWOxRFtqP6IVCIWKxWBXMKJpa2kiXT2R4bIxIfAMd7ZPEglmsQIxyJYdGEgwoIhEPaZeIxSPYgTaOzBl+vnUPEpstJ3bR0hxgbGaBSKKdV/3Fy7h3TwkMfu5Juua9EX5TIIDm5mYKhYJxXVdIKa+u5V48URHEpxyIj/ETPAmANpZlpSzbfk04FLKLxaK5/d571U+3btW/3L7d3L93L7vGRxnOLjDhlMUchqxtkQ8FcKMhvGgMHYpAOIoMhZEBG2HV5pkWoN0q2D0PU/HQTgXjumjXqTYQUgpqTYWE1rX85yodtDyDMtVJEcoXUOk01y4soFyPdGuahbkFIuFIPc1zsV50Y7ZcNeIXREobo8GyJOVCDlOexi1MgJnB1Q5HhrMEbAuMIBSAdHOQaMjGNTbj0w7btx+mf6CXk0/soDlYITM3h0eSvqVnMjwV4K3/9EFcxxXt7W16dna2TUp5ojFmIBKJpEOhkMjn86K3t9eMj49L13XnjDF/SVXOy/D08VtbaEVVkHur53nvHSuV3jw2Ph5tcNtVW6eFw0TCYWKxmE4k4iYWi5l4PE5TLE48FiUaChMLh0mGwyIZCopkJEpzICKa0jGarGbRBESVJlBxsUpF7EoRmS8gczlkqYDJF9AUEV4FyymhK2WM6+BWnGoFi+OgyxXOnJxifUszD4xP0tvXixCSYrFAJBp5FNVo5ND+ORKJEInaaAOZyTEWRrdjlR5AeA9T9jw8V9Da3kxhIYdxSjT1hVBGUswFyBQ8pKlw3ulDVJSHxTQSiCWSpFq3YKc28L3PfYugtFnILBCLdcquri4zPj5+oRCCeDxOsVgUXV1dVCoVVSwWbSnlJ7TWc3/MuRd/iJtCfwl7dyQS+azjOMuMMSuNMScYY5a7jtPuOk5XPptNTB8/HbVm6wWWZWMHAgSDAcLhCLFYjKZEXCUTCdOSStHSlCSVSJAIh0UynqC5KS1iUhBHERdGJLUmWi4Lu1gkVC5iZ/PYC3nsfAmVm6c9U+F58SgPMMnM1DStLS3Mzs4SjcXq9MIHcz6fr/da8c+hUBBpQSQSZGLkYY7u+iHdqTEiliaThWLJo1zOMtDTSluLIZvLk81UKBTKNCdiRCIBJubmCEYSBIVNe3uEjFpOoPMs7tx+lLHRUdra2xFSMD4+zpIlS0SxWNSZTEbYti0ikQhdXV16+/btthDioNb6P/7YAyF/yH5oWSqVRoAR4NbGwENzc3NTsVhMeZ43pLXupJoCGgFCxphOjPHQpklpt0O5bmulSDpHJjYN6eN+xmpJDNK2sO0AwYBNOBQmHosRjYZpisV0KhYz6UjEpFJNpNraSIeW0GkFRLBYwTq014xPTlrr29uFMeYYi9zYRdbn1pFIhHw+TyAYIBKOoCqKyamjWFHBQsFifqZAoexhmSgRKSiXykxMe9XaR1szOBClmHWYntMkUxGMM09vRwcHRktEetbz8MML3HnPNlLNLUCGRCKB67oMDw8zNDQkjxw5QiKRIJlMmgceeEDUOPOrqWZHWk91Xvz7AnTjDtr3fmhjjJ6bm8vWLv6RX+02Eaxeszo4MTERLhQK7Z7nrTDGrDRat9aCL+0Y02aUsrRSbU7FsRyI5cnEZ6qCLEEeS3fZqlbJCKXQRjM1NVUv/ffL/P3mm42dsKrNeKodWDOhPMlUghNPfRY77pqjVBhl9dp2igslpufyWKEAIQmlosYKu3R0RFmYqZBZKJFqaaaQmWP5UILZvIuJbsa1+tl3aBuJeAjtpdBK17P7tNaMjIxw6qmn0t7ezo9+9CNTLBaRUr5aa33b01Tjdx/61o/j3jteLsej/t5gTK35j1ObBPuptgQ7Lvi10aK7uztSKBTClUolaWsd86RsNca0Cq07DTQZpdq1Ma1aqW6jVMzA7UKIsycmJk5ct26dEUJIv8VZJBJ5FKDrwA4GCYTDCFtxeOctuOXDNLf3MzE/TjpQpjXhUVQ22WyRpiaXvp4QuVIZgaKjO8bM+CQrl7STdYPsHmmlb82ZjExnSSaiCBRGGYzy8LxHeqWMjY1x5MgRWltbmZ+fX5x4/+v2/Xsa0E/SYX7Ni/5YGXjHvJfBaCGEAYq1MVd5ovxIynOUUjdPTEzo9vZ2RkZGiEaj9d59PpBt267/bgcCBAJBhCoTSLTR0/98Zg/eS0TMEJAWU7kAGSeEW1aEAwankCEZbsINRRgdnmDjmm4q0ma8uJrmwc0E4p2I2WGamppRnsGNq3pnXR/QbW1tRCLVcPeKFSs4evSoVSqVviiEWGGMeXvDfXzaUj8Jbrv/q4nQqLVnGsZiyy8bzhaPJEotpkJBY8wBIcSphUJhZWtrq9Jay0qlUnfb+fWAiwVjLKEJBQOkW3sYPfAQXvEo8ZBHqTDP0ekKZZOivbmTdBSSUXCNw+hkkaV93cwXcszojaQHXkq6axlOpYj2288dR6rM7wRbLBY5evQojuOIwcFBUS6XVblcPksIsRG4kaoKqP20pf7DB/RvOgEWTwK9aJXwz3cDry0UClZ/f7+YmZkRgUDguO0qquKLFpYtEVgIZZGKxogE81QqE0xPZZCRIfqG1hG188SjC4zMTBKPWbS3RpmvKEYKq0n3X0533zoCQY3W1SioD+DGcyOwoaqs5Odt9/X1ScDL5/NrgMssy9pnjNnbYK3104D+0zp8neHZmubyswKBgGpqapIzMzP11m+NouW+c0VIgxQSqV0mJ3ZTyk8ysVAm1rKa3oET8bJ76IwcIZufIWhBPNzK5Hwf47mltA6cT9/SU2nrbsayDAL7MQUjfTnfRkneQCCAUoqpqSlaW1tlU1OTymazrVrrK4UQbcCdNWvtq+ibpwH9J/b9jTF3CCEuyWaz3T09PcpxHOk4DsFg8LgadVJaSMvC0QYZjJDu2Ug0sYp4a5Li9F202mPMZ+YJRVIYWhjL9RHruQQVWcXA8hPo6ulECknADlV3wbWqmOMBe3H3rEaV05mZGWzbll1dXdp1XVMul08DLpdSZowx2zm2B/fTgH6KHqKBW/sc3APuAV6Vy+XE4OCgmJmZEb6VbBRGr/5evWShUIjW1la7qqrKSqVSIplM4nQ6J1mPMpgrkx2VAVqZ8Shn57xeL48++ijV1dWsWLGCbDY7yQlX0mxlUFe6NpUuTvm5nCUsB7S5XA6v10tDQ4ORUure3l45MjIigJIQ4i5jzPUTVKY4hGNWwKnAi063T03pWGZyse1iZGCvNQ5Q62fGqK+MHy9+CmYRsBu4T0pnThu9DKPDQsgeKVmjlPplZbLsf5qQ+GNek+J+KeUXtDZ/BaYDSAth9RujjwkGqqyWMx8lLjuo3ncJOdtLeMFXKDkjuDOvEo4Eids1JN/+oera8LAsKoQQjl8bY19SIdxxTFhrh5TyUq31PwDtHo+H5uZmFQgERCaTkfF4HGPMQTReuVnkfwZon8/Hyy+/jG3bLF++vDzKbTLIKwP6UAv9bmOfC4UC6XSaXC6H1ppAIEB9fb0plUpqYGDAMTIyUv7uhx0Ox7dLpdJbE3tYnjJcDtKcgEI4r8eUvlQ79/8oOfduZ0juwz18u96/8X5SmZwEOSIEWWN0e6DKTy6fw1bKBhZPyA3eNfP7u5xsPiLANgBer7fF7/fHo9H02UrlHm6bfZpOz77PCtfmaWA3KTMbd2k72V230bXlOY44YSXdU/4NlVa0Fu8xPW/crGLRUYcQji4p5ZcmslilCWttT1it8AQ3exnQ6nQ6aWho0OFw2GitZSqVEpUqOJ/PNwnqssa5UibqdrvZtWsXyWSS448//iANxnsBupLxKLsX2WwWrTU+n49QKGQ8Ho/OZrMMDQ1ZsVgMQAkhHrMs6xbbtl+pcN3MQUKjSMTPeEcspHRdrXXx5sj0ZTZHrnIYy48lsrSKNWR33an2bn3BsjVUhdtV89IfSHf8sdLWtXe7ENaDxqiLD+Guf6dJAo6PEKAns1a5XK4vl8uBcHxMAO66Y82wrkemszQEh3Dsu57Ojb8gHs9QXV2D1bySfDrPvIYo8dInRPMZcxyhTd9Q3Xs3TVOKX4B4C8z/A9ZU+JcxrfW3gTullJ8slUqX9vX1Lerr66O6upqamhoVDodRSslMJiNSqdSkhNThcEx2a6oU8JeBOTw8fFDJ1qGAPtRvLh/r8/loaGgwbrdbF4tFE41GHSMjI9bExXFACPHvDofj9lKptGnitbImeeLqcRwnhDjPmNL5RKMREJ1gLtdu6yFy3FQYfsNqFNuY1mTT3Z1iizqP1vnHW0s6HjFdr99m0gVt+SIRvM5GKUBpY6oqLhL1+7wdf9SWE7CFsG43Rn1+9tF/UqhZeKXLHl1L31s/FQP9g4DE6TAcefZ17LSuolk/T2nz5+g48XJ2lD5LfTiK1fsT3bXhV+bASLdlEAUhrEeEEP+hdemBd6GahGVZy5RSFwNnAY1CiLJKT/v9fi2EEMYYmclkRHlSV2UBQJmmq62tPWgYaNl3LmstpJSTwabX6zUul8torXUulxOJRMKKRqPlUdcF4FUp5cMej+exbDY7VLE/oiLos4A7gM8AuCxw+/ykUmlAjIBZCOI+KczythO/rkNtJ1mJ0bfxtK0kkYR0IUCds5PAyC1E979gEom0ScRiEimuROsf8Hvs/PRRBXRZazAfeAUIhqv9xOPp8XudkGA08477M2Lt3yNNO4HsaohtpMX5FtnWLxAIuihkQiSyBrXza3r/lkflZNmFkBukdNygVHHNBGddyQoQDAYj6XR6udb6fOB0xrux4na7JyWpLpdLud1uM6FdFrZtk8vlRKFQmPSrJ0/iRP/oCeknTqfTTLgYMpVKyXg8TiaTKR+eBt6UUj7ucDhWF4vF3YfkJcQ7wSXuBPM5r8dnV09bjrPpfOn2TxXFzn8u7d/xkksI614h5DNalx6on368MguesKY1xXF0/wOphJuexn+lPVLA3XWtfmPNg+UL5V7g8gka9H2zGYcB/d66j0UgbgLTgbAsgWl0e0Oi/ajzsab+PYOJKo5t/jV9cjkq2Uf0hYsJzTyLiLvEaPBL7MstZFr+NuToQ8bXdJLu37qK6FDfRMJKDAghf2KM8y7I73+3gCcUClWn0+ljtdanGGOWMq4FbphE2ERKu7LauwzisnWufJRZjIqVBnYBr1qW9ZLT6Xw9n8/3HHK3KoO4PEToDIT1WYxpFkLsNEZf4vZ4rNoTbpTh9vOEvwr6E1U02K+Yzqc+bZKJRMqyXH9m2/mHfFWeprrTHjezpxqx9scryBo/p668gbFtj9pb17/gENIqSMHZSqkXPkgG4KMOahoaGqpGDxy4Utv2t448/pySe+Edzjd7GlkQfIL+Jy9k1pnfou/tR+jbsx6HgJmnfpn8zCvIpWrw9t5CnW8fA3Xfp8q8Rm3sQd255WXiIztkcdzWJRHWaktaDytV8wwMZt/rB4XD4VA6nZ6hlJqltZ4LTAOagGrGh4/6D3FnxISVi01YvgGgV0q5XUq5w+l07snlcv3vkiEW73Gb/xMQT4ER5c0RQhCauoSaUx9neukudq/9Lt7ao2ideRq7X71H7+/plkLK143BSKOPbz/tGh1vuErOsZ5n9zNXk80kVDZXtED0g/nLCT3MB9Jg8qMO6DKoy5bpRIR4xeNymYWnfEKX2q62huOgt9+ASryF8M9B5UexCqPUnHQfzfVd7MktxXT+jLC3QK7hEqZX72LIXsjQaJaa4tMmuefnemz/61YmO1m3141wvGo55b97nM7fZDKZkffzW1taWtyWZRmllABQSonBwUFV5sLfD9uDZX1MaHmyMWoWmHZgP4gjBHpG3czzS5G202V0+21mZGCPo2nuCsyR9+BNric7vIOsqEL4a6j1Zklvu9WM9L4thLQwWumGWStk7Sk/oi79c7Pxyet0MpW2hJS/NFp/Eejn4NKsw4D+gFZ5kz/NeMmPNeeIo+y6Y//Z0VU8iXisn+lNFoWNV2LVLcWET8HZ8y2GWr5Lq6ebXNZL0KzFKUsc8J5DQI7QVTwBR0kTEutNqf85nel7TsRG9sh8YdIwxYCdCLERY+4hEOghlTrw37mj/DcuUmcFyAU+XwNKeSgUBsYtvfg5mDPKmTopoajGD3U5jKk5ZZU4EFjJPO8T9Dx7KflikdZl9zBmfRyXEywnGGeKRNrJdPtF9j/3CZ1IpiVAMNKo5i083ry17nGZLygphLjeGPNPh8YShwH94YH6DCGsHxmjZkQifjVj6d8JEV4so2/fgSaAZ9F3yO+6iXzfi7BoNXjqqRNbGV7zF3iCrajCKFWhaYx1PECjfy/a8hDNTGdqsJvYwHZN7DVTiq4jMdRppRNRSuMQ1eMAl3uEMGuMcayyLNlkDC1C0KeUYwtkht8Biro6f1U261NKuZVSISllvlBo7IP9eaAVYV2N0WeCaQU8IPYLIZUxak5VoEZVt/+58TUtErgjggNPms519wmXQ8i603+CbL6IZCzNfNdjbHrib3FV1TDr2ItQpSyF1ACYKOmaC3DWLqfwynn0dO/JCSG3GaMXVwR6VwO38NuuqB9oZ1THYQwftNTEnqwxRi0Rwro1Gk1/KrH6Bqp8LhNumkXk9O+JkWgtcnQnGgc2XlJpSXXqQYYHejADPUig/ayvIB0+Slv+EXzTaT/i7/C607ypzpVHz5vHMTNX8sbGpBGFET3y9q1mpGuDw+3x1hSzqRrbsARKX1aq0uAUYgixCmOuYbyt10XA3zI62p4Z962dgG/cddrfDzwF4kyMmuFygMsXQQpDNhmbaRuFL1CrGpZ8z4q0noLHm6Y70UQwOJXwjqdIxEdxO5wcWbeGrQcS7CxdyLwz+nnrqWsZGsrg9AQZ3buJQjaPf5GTWe1DZm92PCnjdrsuyOeLy4Ul2owST4H9Gh/ixFrrMIbfscpyxwyYR6WUnVqLtkLRbi5k0yKodtrTG1wkB9cLZQT52oupdXSS2PBVMpksQjqYMu0oVPtXCJkt9K27AWNsapzd9MXAGZlPVecX2bf+QVJ1nxF7s6fJ+uqc9DsSJnjMbfibTtJkdmhhJ636tuO0t+YIFQgEsfNjPtvWxyHE/AlX4udCMDXg9wa9VUGP2xdyOl0BPL4qaVSuWmmzGIjUtx5tB47+BtULv4Cr+VOEm+cY4huNFZ5nuRb8E+3qZ3Q+dTGu5CtEIjWkhzaTTkapnrWSdMqimIgTdR9DyT+H1sB+XM4QqdZv4p15Hk3zL6S5qZ7c9u/a+3ZssoQQW2zbvgnMJox5EXQf77OvxmEL/cFZagEIrfUqYJWU8rP5fPa27eufrure/gJ2SeuWWSfK1ilF0jvup2d4GLAQ2qaq7VyiIkxt9HEyuSLZ7rcopnpxLr2CYKmTPZtWo4WbxiMSuJ02eXs6QZ8Qef9MauqmWGGziJzjWqPqT5PBsEOmYiVqU8+b/te+rmMHBs8TwjrbGGVmH/NJTetnZN7ygmUB1SKXU6ax+JLp/c01uqpuprSOu9vR2BBhiv0MI+4W9vk+L+oWN2HHfkEypXgzfQamxQH5IXTvToq2wMJQyCWQkRXMbVxHfewetiTOxq6/HveeK2nW91Jb28DgllWqe++bYrCvxwkigzFXTexbuWmP4UMeOXfYQv/nq5wuxxizCXhEWM5SqViqVlrXF7NRGj277X2bf23yuZyQUojajjMpTL2GsCtJbsd3iEfHtUs1bSdit16OP/E4wzt+Tf300wjM+FOmNSUYTDoJljbiqFlCYPQWYnIx0eAlYqZvNbL3Vvx+F31ypagJaJnofV5rIx1gRPvMWTJdvVKMFaeKhY1vilDxdUpyiojKc0WD4w1Jw3JRqLmQjuyNPHPvlykOPUl1yzEMOFdQb7+MR/WiwqcjapbhaFxO0rmM8NQTcSafQYcWs2RxG9seOZudr/+Suo5PIHyz6Wh1kHj7Zr173QOia+cmmU4mBEJuBHPxRJKq7F78TpqMw4D+YEFd3qtRjH4auBNksVQqnNHXtUPmc1kJiNqGFj13xb+J7vQCAo69RLfeST6XRwK1C/6aQugEvIO3M9a/nbrZF1JVFcQaW01Unkpz+zQymRz2gbUMeC5jSniU0bV/w9vr10FqE+6WPyVtWpFjj4p8LmNAirH+7fjr2nGH55F843I2rVlFKFJDyn8qU32bGbNnEggtILn9RkaH9pPJ5AlWO8nWnI8rt5vRDf9CLW8RTD5KnXiDkHuUEcexhB17yDKFA+o48sMvoEopFh17tA7E7tPdb97Nns7dMpfLIyzH/Q5L/o3W6rpxyu/DdS8Ouxy/uxtSwVnr63E6n3IYuVTrUlZr873Y2GBwZO3l9nEL/1iUREQOlAQCRNOsE0kFz8Vr0hSiO8Fo3A0LyMd2EO9ajXPe5+nMLCWcuZd8QaDrpiEzDzDY04WUFvGxUWpVH0X3XByeGuBABin7SraZY0pjOqNC0tRfRqN3jGz1n9NR10XqtZdQ4bnklcFj+UGAEBYqM4RLGKS/likLLyLhWkp267dJvvYIkamLCZxwPD6fF1nloybcY/JTmvXQ7jXylYc+J9OZYjlL+aZlWX9v2/ZL9vunFA8D+g8sYNRl/5pSaaMNGyfeG7Jt+7ad2zZN371tE6FwiGw6idvtVB3HfUZ20yakSVM0bqbOOhkrsJT82O0kR/bgm59gNDmFUGonhVQcpyUo5TJoM96tF+kgpyO4BBhhA9gCOWawcVIkUzDMPepj7B/wI4zE2v1/2b55E62n7idWFDTULkGYxzEGnO46MBKPjpMb24w++ps4IifQWtyGtKbT4Omka8dq7a1aR/eGMTnQ228ZIJ0p7hDCsUlK616lCs/atl2u2+TDoOPeT5bs8PqfuSHlig3HxGM1cJR0Oi/VyLWxWGLQGJMqFG1r27PXidC+T6spxZ/aU6e16eYllxHXjQjfFOx8Ep3bR9CrKRzYgc4P4aQf4+7AH/BhjKKmdTEZ00ZIdJpiZgzgAEKsB6CYMj6nwDv6Y9rM98mqDAPyNPyBAIV9vyIshhj1fpy2I86kprEDXXsRQWcaV3oD3dtfV23Z+82iyBbd6N6lQum77b1Pf14P9e2XXbs2y/7e/qJB/Aa4AL4+3xj7U0oVnuG3Rch/MEA+bKF/vxa7bBxSulS6B7gnEokEo9FokzHcMTbcf/LYcL9D8ASWJWmYtt00z3xZK7tEdwHRqrfIWn8dvSM7yCaHzBHieTEgPk5k/rWE4htg+lX4vRLX4EM6Hk9aCLkLrarH/SCJER76x+oZee0KWpfXs6/604SXeBhbdwWRwWtRM7+KveDH1DizuF02gbGb2fzmYygjre3Pfg1lF0Q2Z/+2SbMQT0rpvMOy2FMsFneNv/qNypjrDw7I5XU4U/j73095aITvcrlm2Uacom37ZIxaCnRUfiQUqSNU20Df3h1oZdPcOp2pJ32NkvdEtJCUdAbv6P1see4Wnc+XpGXJC5TSN3i9ntltZ95lRpzLxYyaFAde+WsODG5j1oq78IY7SGz6F7a8+gumH3ECDTNXIESBsX3PmT1vvyGUxoBYA2Y+kAW5QQhrp5T6FXVwYWv5f1L/W07A4fXB7W1ZCFRJX/ktl+tkrcwpRtstGKaDWTrxXhIhBjBmTlWV07TMWCikJ0w+3ktP506tDBLEN8F8Hehzud1TWuaeZVxVXuEWRUa6tzLYt4e62ghVgSBDg0Pk88VKYzrxW0QWKb6K1t/3+/116aqqLMPDmXdhwAz/y4Z4/n8uRF5WE/l2QgAAAABJRU5ErkJggg==';
const $=(s,r=document)=>r.querySelector(s);
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

function loadImage(src){
  if(!src)return Promise.resolve(null);
  return new Promise(resolve=>{
    const im=new Image();
    im.crossOrigin='anonymous';
    im.onload=()=>resolve(im);
    im.onerror=()=>resolve(null);
    im.src=src;
  });
}

let leagueLogoCache=null;
async function transparentLeagueLogo(src){
  if(leagueLogoCache)return leagueLogoCache;
  const im=await loadImage(src);if(!im)return null;

  const iw=im.naturalWidth||im.width||1,ih=im.naturalHeight||im.height||1;
  const cv=document.createElement('canvas');cv.width=iw;cv.height=ih;
  const q=cv.getContext('2d',{willReadFrequently:true});
  q.clearRect(0,0,iw,ih);q.drawImage(im,0,0,iw,ih);

  let id;
  try{id=q.getImageData(0,0,iw,ih)}
  catch(_){return im}

  const d=id.data,n=iw*ih;
  const dist=new Uint8Array(n);
  dist.fill(255);
  const queue=new Int32Array(n);
  let head=0,tail=0;

  /* V483:
     Fondo negro -> transparente.
     La bruja, luna, escoba, letras y contornos negros SE CONSERVAN.
     En vez de borrar negro conectado al borde, conservamos todo negro que
     forma parte del dibujo por proximidad a píxeles de color/luz del logo. */
  for(let i=0;i<n;i++){
    const k=i*4,r=d[k],g=d[k+1],b=d[k+2],a=d[k+3];
    if(a===0)continue;
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
    const foreground = mx>58 || (mx-mn)>26;
    if(foreground){
      dist[i]=0;
      queue[tail++]=i;
    }
  }

  /* El radio escala con la resolución. A 700 px equivale a ~14 px,
     suficiente para conservar los trazos negros originales de la bruja. */
  const radius=Math.max(10,Math.min(34,Math.round(iw*0.02)));

  while(head<tail){
    const p=queue[head++],dd=dist[p];
    if(dd>=radius)continue;
    const x0=p%iw,y0=(p/iw)|0,nd=dd+1;
    const visit=(v)=>{
      if(v<0||v>=n||dist[v]<=nd)return;
      dist[v]=nd;queue[tail++]=v;
    };
    if(x0>0)visit(p-1);
    if(x0<iw-1)visit(p+1);
    if(y0>0)visit(p-iw);
    if(y0<ih-1)visit(p+iw);
    if(x0>0&&y0>0)visit(p-iw-1);
    if(x0<iw-1&&y0>0)visit(p-iw+1);
    if(x0>0&&y0<ih-1)visit(p+iw-1);
    if(x0<iw-1&&y0<ih-1)visit(p+iw+1);
  }

  for(let i=0;i<n;i++){
    const k=i*4;
    if(dist[i]===255)d[k+3]=0;
  }
  q.putImageData(id,0,0);

  leagueLogoCache=cv;
  return cv;
}

function roundRect(x,a,b,w,h,r){
  r=Math.min(r,w/2,h/2);
  x.beginPath();
  x.moveTo(a+r,b);
  x.arcTo(a+w,b,a+w,b+h,r);
  x.arcTo(a+w,b+h,a,b+h,r);
  x.arcTo(a,b+h,a,b,r);
  x.arcTo(a,b,a+w,b,r);
  x.closePath();
}
function contained(x,img,a,b,w,h){
  if(!img)return;
  const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
  const s=Math.min(w/iw,h/ih),dw=iw*s,dh=ih*s;
  x.drawImage(img,a+(w-dw)/2,b+(h-dh)/2,dw,dh);
}
function cover(x,img,a,b,w,h){
  if(!img)return;
  const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
  const s=Math.max(w/iw,h/ih),sw=w/s,sh=h/s,sx=(iw-sw)/2,sy=(ih-sh)/2;
  x.drawImage(img,sx,sy,sw,sh,a,b,w,h);
}
function outlined(x,text,a,b,fill='#111',stroke='#fff',lw=5){
  x.lineJoin='round';x.miterLimit=2;x.lineWidth=lw;x.strokeStyle=stroke;x.strokeText(text,a,b);x.fillStyle=fill;x.fillText(text,a,b);
}
function fit(x,text,maxW,max=39,min=22){
  for(let s=max;s>=min;s--){
    x.font='900 '+s+'px Arial,Helvetica,sans-serif';
    if(x.measureText(text).width<=maxW)return s;
  }
  return min;
}
function wrap(x,text,maxW,maxLines=2){
  const words=String(text||'').trim().split(/\s+/).filter(Boolean),lines=[];
  let line='';
  for(const word of words){
    const t=line?line+' '+word:word;
    if(x.measureText(t).width<=maxW||!line)line=t;
    else{
      lines.push(line);line=word;
      if(lines.length===maxLines-1)break;
    }
  }
  if(line&&lines.length<maxLines)lines.push(line);
  return lines.length?lines:['JUGADOR'];
}
function playerFile(){
  const p=$('[data-v64-photo]')?.files?.[0]||null;
  const d=$('[data-v64-doc]')?.files?.[0]||null;
  if(!p)return null;
  const n=String(p.name||'').toLowerCase();
  const bad=/(^|[^a-z])(ine|curp|credencial|documento|identificacion|identificación)([^a-z]|$)/i.test(n);
  const same=!!d&&p.name===d.name&&p.size===d.size&&p.lastModified===d.lastModified;
  return bad||same?null:p;
}
async function playerImage(){
  const f=playerFile();if(!f)return null;
  const u=URL.createObjectURL(f);
  try{return await loadImage(u)}finally{URL.revokeObjectURL(u)}
}
function teamLogoUrl(team){
  try{
    const u=window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||'';
    if(u)return /^https?:/i.test(u)?u:new URL(String(u).replace(/^\.\//,''),location.href).href;
  }catch(_){}
  try{
    const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
    const hit=Object.entries(db.team_logos||{}).find(([n])=>norm(n)===norm(team));
    if(hit){
      const v=hit[1],p=typeof v==='string'?v:(v?.local||v?.source||'');
      if(p)return /^https?:/i.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
    }
  }catch(_){}
  return '';
}
async function transparentTeam(src){
  const im=await loadImage(src);if(!im)return null;
  const iw=im.naturalWidth||im.width||1,ih=im.naturalHeight||im.height||1;
  const max=360,s=Math.min(1,max/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*s)),h=Math.max(1,Math.round(ih*s));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const q=cv.getContext('2d',{willReadFrequently:true});q.drawImage(im,0,0,w,h);
  let id;try{id=q.getImageData(0,0,w,h)}catch(_){return im}
  const d=id.data,c=[[0,0],[w-1,0],[0,h-1],[w-1,h-1]];
  let r=0,g=0,b=0,a=0;
  c.forEach(([xx,yy])=>{const k=(yy*w+xx)*4;r+=d[k];g+=d[k+1];b+=d[k+2];a+=d[k+3]});
  r/=4;g/=4;b/=4;a/=4;
  if(a<20)return cv;
  const tol=50*50,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
  let head=0,tail=0;
  const near=i=>{const k=i*4,dr=d[k]-r,dg=d[k+1]-g,db=d[k+2]-b;return d[k+3]>0&&dr*dr+dg*dg+db*db<=tol};
  const push=i=>{if(i<0||i>=w*h||seen[i]||!near(i))return;seen[i]=1;queue[tail++]=i};
  for(let xx=0;xx<w;xx++){push(xx);push((h-1)*w+xx)}
  for(let yy=0;yy<h;yy++){push(yy*w);push(yy*w+w-1)}
  while(head<tail){
    const i=queue[head++],xx=i%w,yy=(i/w)|0;
    if(xx)push(i-1);if(xx<w-1)push(i+1);if(yy)push(i-w);if(yy<h-1)push(i+w);
  }
  for(let i=0;i<w*h;i++)if(seen[i])d[i*4+3]=0;
  q.putImageData(id,0,0);
  return cv;
}

async function makeCanvas(){
  const cv=document.createElement('canvas');
  cv.width=1011;cv.height=638;
  const x=cv.getContext('2d'),W=cv.width,H=cv.height;

  const name=($('[data-v64-cred-name]')?.value||'JUGADOR').trim().toUpperCase();
  const team=($('[data-v64-cred-team]')?.value||'EQUIPO').trim().toUpperCase();
  const teamSel=$('[data-v64-cred-team]');
  const cat=(teamSel?.selectedOptions?.[0]?.dataset?.category||$('[data-v64-cred-cat]')?.value||'Por confirmar').replace(/^Categoria:?\s*/i,'');
  const curp=String($('[data-v64-cred-curp]')?.value||'POR CAPTURAR').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18)||'POR CAPTURAR';

  x.clearRect(0,0,W,H);
  x.save();
  roundRect(x,5,5,W-10,H-10,34);
  x.clip();

  /* Diseño físico rojo limpio. SIN líneas blancas, SIN rayas diagonales. */
  x.fillStyle='#d83f60';x.fillRect(0,0,W,H);
  x.fillStyle='#0a8049';x.fillRect(0,0,W,126);

  x.strokeStyle='#15171b';x.lineWidth=5;roundRect(x,8,8,W-16,H-16,31);x.stroke();
  x.strokeStyle='#8b203d';x.lineWidth=3;roundRect(x,17,17,W-34,H-34,26);x.stroke();

  /* V484: imagen suministrada por el usuario, usada directamente. Sin procesamiento. */
  const league=await loadImage(LEAGUE_LOGO);
  if(league)contained(x,league,20,12,180,150);

  x.textAlign='center';x.textBaseline='alphabetic';
  x.fillStyle='#fff';x.font='900 31px Arial,Helvetica,sans-serif';
  x.fillText('LIGA MUNICIPAL DE FUTBOL JUVENTINO',580,49);
  x.fillText('ROSAS',580,86);
  x.textAlign='left';

  const tlogo=await transparentTeam(teamLogoUrl(team));
  if(tlogo)contained(x,tlogo,830,128,150,150);

  const photo=await playerImage(),cx=205,cy=365,r=131;
  x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();
  x.fillStyle='#93a4ad';x.fillRect(cx-r,cy-r,r*2,r*2);
  if(photo)cover(x,photo,cx-r,cy-r,r*2,r*2);
  else{x.fillStyle='#fff';x.textAlign='center';x.font='900 28px Arial';x.fillText('FOTO',cx,cy+10)}
  x.restore();x.textAlign='left';
  x.beginPath();x.arc(cx,cy,r+5,0,Math.PI*2);x.strokeStyle='#075a37';x.lineWidth=9;x.stroke();
  x.beginPath();x.arc(cx,cy,r+11,0,Math.PI*2);x.strokeStyle='#222';x.lineWidth=3;x.stroke();

  const tx=392,tw=430,fs=fit(x,name,tw,39,24);
  x.font='900 '+fs+'px Arial,Helvetica,sans-serif';
  const lines=wrap(x,name,tw,2),base=292,lh=fs+7;
  lines.forEach((line,i)=>outlined(x,line,tx,base+i*lh,'#111','#fff',6));

  x.font='900 31px Arial,Helvetica,sans-serif';
  outlined(x,'Categoría: '+cat,tx,405,'#111','#fff',5);
  x.font='900 29px Arial,Helvetica,sans-serif';
  outlined(x,'CURP: '+curp,tx,466,'#111','#fff',5);

  const ts=fit(x,team,330,45,25);
  x.font='900 '+ts+'px Arial,Helvetica,sans-serif';
  outlined(x,team,45,592,'#fff','#111',7);

  x.restore();
  return cv;
}

async function render(){
  if(route()!=='credentialBuilder')return;
  const target=$('[data-v196-preview-canvas]');if(!target)return;
  const seq=++render.seq,cv=await makeCanvas();
  if(seq!==render.seq)return;
  target.width=cv.width;target.height=cv.height;
  const q=target.getContext('2d');
  q.clearRect(0,0,target.width,target.height);
  q.drawImage(cv,0,0);
  const h=$('[data-v196-classic-preview] .v196-preview-head b');
  if(h)h.textContent='Vista previa · credencial roja oficial de la Liga';
  const s=$('[data-v100-credential-style]');
  if(s){s.value='red';s.disabled=true}
}
render.seq=0;

function canvasBlob(cv){return new Promise(r=>cv.toBlob(r,'image/png',1))}
function download(b,n){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=n;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);
}
async function png(){
  const b=await canvasBlob(await makeCanvas());
  if(b)download(b,'Credencial_Liga_Juventino.png');
}
async function share(){
  const b=await canvasBlob(await makeCanvas());if(!b)return;
  try{
    const f=new File([b],'Credencial_Liga_Juventino.png',{type:'image/png'});
    if(navigator.canShare?.({files:[f]})){await navigator.share({title:'Credencial Liga Juventino',files:[f]});return}
  }catch(_){}
  download(b,'Credencial_Liga_Juventino.png');
}
async function pdf(){
  const cv=await makeCanvas();
  let JS=window.jspdf?.jsPDF;
  if(!JS){
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    }).catch(()=>{});
    JS=window.jspdf?.jsPDF;
  }
  if(!JS){
    const b=await canvasBlob(cv);
    if(b)download(b,'Credencial_Liga_Juventino.png');
    return;
  }
  const p=new JS({orientation:'landscape',unit:'mm',format:[85.60,53.98]});
  p.addImage(cv.toDataURL('image/png'),'PNG',0,0,85.60,53.98,undefined,'FAST');
  p.save('Credencial_Liga_Juventino_tamano_INE.pdf');
}

function schedule(){
  clearTimeout(schedule.t);
  schedule.t=setTimeout(render,80);
  setTimeout(render,280);
}
document.addEventListener('input',e=>{
  if(route()==='credentialBuilder'&&e.target instanceof Element&&e.target.closest('#screen'))schedule();
},false);
document.addEventListener('change',e=>{
  if(route()==='credentialBuilder'&&e.target instanceof Element&&e.target.closest('#screen'))schedule();
},false);
document.addEventListener('click',e=>{
  if(route()!=='credentialBuilder'||!(e.target instanceof Element))return;
  const b=e.target.closest('[data-v100-credential-png],[data-v64-download-credential-png],[data-v100-credential-pdf],[data-v64-print-credential],[data-v100-credential-share]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(b.matches('[data-v100-credential-pdf],[data-v64-print-credential]'))pdf();
  else if(b.matches('[data-v100-credential-share]'))share();
  else png();
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
const screen=$('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
setTimeout(schedule,0);
setTimeout(schedule,900);
setTimeout(schedule,2200);

window.LJR_V480={build:BUILD,render,makeCanvas,png,pdf,share};
})();