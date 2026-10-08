/*
V914 — Realistic Football Jersey 3D · exact transparent Liga/category crests
Only the jersey model/rendering is changed in this revision.
The primary mesh is the MIT-licensed classic shirt GLB from Mini Jersey 3D Studio
(Francesco Castaldi). It keeps its original normal/occlusion detail while the
Liga texture is projected on a separate UV channel. See THIRD_PARTY_NOTICES.md.
*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const INSTANCES=new WeakMap();
const LEAGUE_LOGO='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAACTCAMAAAAQusOOAAADAFBMVEUjlmKik2YNYibhUWpjj3DnKmKbpJgjhmGjW5YdJh8hb1FbZFnpIB/l19RfaV5ajWoaKyEib2AghG9VjmvTppJam20kXszkXlxgYl6jVF+hX2JeZFlKKi6gaWEgZ5vJUHfzaZRhYMkwXlkkhXgaTTUcTzbvKifIWInVx7IIlyrPpGUTLyerUWIkbVsoipGmx7J0GiJmUp9YKjFjsqJupoxomYvOT2m1VYmmiDMbRzF7EHq7Nzm8zMOVaTJIPUSanpTJWYrHozKsIVepVacAAP9e3aNXTTCObcanp6Roo4XqQjyXjHbOW4U7PEGMN0rVO2z1PEEMMB51M0NwbSSq5ap//39t/++GOEiBOUeaTzq3VIWepGcj3ZWt//f9l7HSvsAqiob//38AD3QM8nhRNjR5NkVkWTxeUjuvMyyUkHT/f/8SrqB0xJyUporuYyP/qOb//wD04f8nPcYAf/8IgzdVVap/f/+HKTy/P78/f78ulYAxgMlSPrR//wDmODrDoo3X2tkAAAD6+/oEBAQUGBUoJyc1NjaJiYmVl5YIelC0trXJyMenqKfV1tQEezsQJRkAfn4YZ6//AADo6Od3eHcoeK4pFxkphZBDQ0QOe1AA/wAlepFwV65mZmYTWbZVVlasWJN/f3/ROGkYdo33KClGR0dra2v1FxZyc3L5NjWOWahpammRZa5JSkpOSa4MiE37R0gAVVX4V1YuhawUV8dLTExRU7X2dnYA//9XWVe0lzb0aGcAfQP///9ucnDWPFjtN2z0h4fwlpTLurIjaq8XenKxVozSRm4ThFIPeVb/f38FaDPUR2ySVZbMSHIVe2Y1Rrb/AP8AVQIAqlWqVVVQU1PIqU0WemhNTE0ZeHhMVsgLiDYteVPwqKYuSMcnhnRtbG3TRVLwtrQvHCEpfFK3VYfWO2oSNiUyQzomZ8ezl0mxp4/8VVUbdaqpZakUNiUXem4nhYe+Pn0AOwQlIhwpKChVqlUcJiJxZLhupIbIpjcEbEoqhWkzmGprTKxlZGRHRXj6AAABAHRSTlMY9BMZ4BPyWvHZYCL3+VejphGcYP4b/eLoYpua6NryZhn96NiaYgmb/g79Bhyb8v4D/aEOZvKdpf7WBAT+8fiq4P8IAwEL4v4HnOunYfpiWORknQwNAgSg4KVwEAoEDf2rAgIDcmRxo+JjAgj/bAgKAQj+AkQDAqYEBGP//wK0prwA/v78+/z9/A/9/v79C/oC/gH99P78+PMsAfv+T/xN9QIO+v3Sjv3Q/P1v/q79EPsD+v78kf39ATf+/QQBsBAL/v79/c7PLy5OAgwP+Uxy/AEFAwNv/o9x7v0TMf79sK0Q/f0NsCv0+v7+/QP+/Muw0QQH+tAD+v74/wtwDv42YVZYpgAAKopJREFUeNrNnAdAW+e59zXQNlqMCMTe28aO7dqORzyzkyZNcjO7d2/bu++3v9dIgsMQkkAIIQECBUKZoQIKLqsxexuDMSNgJ8Y23ttOvO7zniMxbOwYB7v3bYNABul3nvN/5nuOaBK07KsyXE1oECIIhDQEoSafg59RVtb836qQIAZSj+PnsvCvLmHR0JNY4ZhUU0H7CfkT0WFE6CZ/pPUC39g5Et1J8Pv7jRiTOLgzT0Md0H8DaDXtYAVpPOIWxzhiMBhonYFWrdbHFDCqzYmRBsAzBqkR1R8kfzur/r8DNA1sVzvYwZnqDzQYAkb1OQZOgF6rN2h9DKYc7UU+fGnR2qSXGwjplHEcdCTpUP99oYmOCgnB6CCMgTY9MJr6pfoqUzRwto7EWANatdofGQ1VWh+t1tCBWm22QAaqMCKGuoL2d4PWVKrV4QzEuWi40Gl1d2/Rt5g6aIYca6s1R89BFZ0cqfZsa0dMld4E5qfBv+QAujEwhtPt8NinDw2yYIz3/0gaqNea1Lf0VVXuetNUZ0yOVQrQHQj1qwF6hDDA81XaVkbgWfccUwfqtOoNgRXqvxM0MXjZSJuyuRtaTVpTJ7C4g7Evdo7m+EhNVfpA4y2DVKrVRxtNIA+r1Si1tbjnWPmo0+TeEmikfFLzdKE1mgrUcdEQOKqt0vOn9KYR46hWr61yv8hozdG3gpZtBoMpwJCj97mgr7K1XjAyDNoZ96qz/QhEbxtRO0holcckTwW6nqiogAfjRdDwBYP72VsdJlM0kp71MeVU+UCwaLnIh4in14+2GrRak0mbY+OjCvjllpkqvVQDTimtxyAEQXA64aHiqUBXqtFl/o84F2zuVTaO9KzWwDCZfML/p14faM05Kx09qx9ljFito6P9xgvW0Qut1rMGDuKczbFBUPlf0k5bjonE0BghpsfcQurKJw4tIZNz95RNbwvwgdM9xTDl6KVTJitjSqsdDbS2dhj7+yEVSoydxiyk7uw0Gjm3aDTUb7VG3zpbNWMwtMxcZMATGs1BxmjOjC3GiB06vAJVZD0x6O4sXFQYA7XuVSaTu3uOrTNaW2Wz6a0MqdXU393ZQfkoMT4OD7VzZ97YD9aOgXxjy5kx+MQEElkSxNFXubfYLlYgjURNqOuftCMSF8j3m9HnuIOptVqt9cI4wen4P2TsJsj6yVhRC5ZmaOrrCU0tGd9uQ+DubwVJ2/SmwJs//R/ERfccvUlrmyLPYDjxhKErkdGqdZ+ZmTG1VNmkfKuPtZXxr3CO4V9qoaBb+Pa1VB7REOH4/Nf3t1p9fExG9A4YOsc2IoUahcGRdiKNunv8yUDD266pJNPKiKEFzGyCrDE6SIBw4aUrSEXgQwKrzncDytOI8fpajRoNqkH0RgRSh3h4EV10b/ExjsbEdCIjMa5+QpZmUFANxJRJr89pMVit/VC8MUgnUkvmJ0u0GANZ6MHzxk5+DPhC9JS+Sh89YsvRGzhqI/FkoIkpwy0wKgH/7zC1gPsFjnSEAyHkilrwvm40602Dg5Hd6sjIeeGskiDzn1pNGCU3jQQH0tJagw0COd+gzdGaYqTGm09AHpUHEccAma4fVVQSRo5JC8hgW1Dwsdl03I3Q5cuM7gVBkhF5mYoo1KkizakOR52t1paWnBzThUCwtqkFl4HLbuks9c0KxLFWQaiVErgkHWkdMeJ0Pk/vs28zwY/mB8PiwyPtHYQ+Ij1yHpPm4EGk5rRarYZoSDlVLSYDpKjljR5qeIebBGEkg0YOFEOc8HE4y/WAXE+J1B4wJiTBG87zxLzUeYvH450/vyGYwZ/4aIF/7oS/6+fwL4I/t2hNAdaRQQlDrQGJqCuWBZpQE0Q9BF1UH6jXz1RVaWNG1JGIoGWhg+Hkv3d3I9oufpD4BEAqyJUB68qV1CtXFBic/HJCHMRH1+YsUVkJ3EYrGGHUFMDohHSjxicU2t/lkQfosWPqIodA/RAxTDPuZy/Mr58iUYNbcBAP82YoYalgvaqaW/AUHEYqD8w9T0MV4JNQK7ZaoTMzQXWC07iRY0TH7rX140PzDXot9CfRphl9q+nsKIEDMrkisa8FncfWJXFfzczMLCgrK5MPV1eXVcsDAlQYOTVVHNxwn+qggUFqqVU7o42Rop0HNcZRQwzt4G3oeYhlkAfqN7S0QHlsCDDM6C+OSCWOQQCWNF8MwFeAeEtmZln14Vxhbq4wOzu7RHg3tywA7AzE54MnyDh4b2JV45eBOtYqpdVCCIccqTfg/sBIWw7oC3qtzwgYG7zcp9Ue0aiOKVicqohTqIC4AIDrAFbeWFRUlH6kUDhc4AVWTj0BUr6feFZc/4KMF/rrB0EtUogjQM1HkuUJedKzZ6PHcRIwGCDjajRQSqLuemKXREw6ngqIwbwlhY3p6enxsOiN2XXVJ1XKDEVq0Ld1JhrqC+OCLQe6SVB4N4323aEZHfVTUOqPtI6ehaaVrH/HO5Am8jYtKBVcTxWnLAMTFxalO60F3oSEhPj0I3dzC1QqCB1iCaplVGoquh+GvvMmAXUrMM/oDfoWCNg7vyt07aDUMMLHdUYgtN2BDLJ+UFdA/Rt8ApxPlalUlGWXHEmnk7xsNhuYC+8OZ2Ixn5fYZQHx7cHvcDCru4Jx4WyVFkvaZIiW3lowO6MtPWzkIamhBeoDfc6MXq+1koIjyx4BmFmpDAgoUCrAyCRxMl6YWVBNMgfRqPLq4YUjpHRUUT9i1doCTD/qlwYG4CaM8djQB+sJ4gCa0kM902rS5+Rorf2DZI8o6Ea3N1zHZi7LPawoIEWRnJwIi2Suq96NmYNpNx8p347jWqSidbS1kzOO+IF6H32gejakLhEaird6HDk4BpL6wujoBePsP06cT01VqQqq64QbFE4U8cqkJDuz/CTI+QSfdvlRFYgN1ElW2f0x8GbWQCmjNqvyMaDJrilSU/nbQaM0RguN0Wj/OHWys1ADP1VxHcxcl91YpBKzARmIUyjmI3chOkNonmiA5PEob3SzYi5wc6z4nVoDDbcoEeLScCnQWWQ4HoRyGXKLqSVHO9rhqOneiU7F0qiuKymKL1KkgyqSUmA9lwyB40hddQDYeYPk4CB6tNmXmhhnYO6DlZr6Vq2P7WLnlKnF0EH+MTbcEjWtQZKLAf2IRpMGGPQ+rRzUrcHFw0cU87CgEPwvM44nS0xxTkujDF2UDcxKhZi2lGn/ONXV1qJ6H5+1UwypvqXFwB8nHs8Ra+uleq2NgzpiTCZTa4cR/Pxm5SDiU8x3j6THJ8iV6Ud4gA3QpDiEZKw779YtWML73CS3NUAdHT7atYGBthabaVR6GXeUS4cGTwzUVmkNU52QvEfBCf81HBcbFHNuNsS5BBAH6GJrgbKADcoGJ4ScolSc4KgfJ4lpUEXrWXe9Xm+QjloNMeoOguwslgQ9TkM3pTFnsWfYtD79EEegGQCtnAfmAmCGOBevkCWlpO3dm5Ysu6qUN65tFJSdVOK4wdA8Vu7N6mi1mkyBI9DTaGOmIIsuFVpDDtnqORCDWlq0rRCyCXhCffs8aWdBUXxCcoKyGsS8F1ZaElt2VaEUl6lUilR+LfzxY9kaskz/CKdeMziin5mBIue3S5cHFYqMgbaqHGv/zp0HKyqR4EPIg9gHgZmdLFYl2ZmxF8bLoHCGCmkDDSrO8IOLdHqaB49T0FzlSDAYtwwtVVW2H9EaHrP20KBuqdXaOigZx/skP8WCzqwWFq0FZpkykUTeu5eKHI3ZXoq4ON7EIq8SiYKCJnYNdj/C+0n4Uz6QfVv0ORACNEuDJmizER/hZCWBNqhWM3FCofQqq2sEPSfLeMkUMhg6jIwchzOxOOoXGSVCyDkBaR3drP/WlIZabTPQ0wVYtSaIsePqpUDPzuqRJo+Kf26CSKhFr4MTFq4F5q3irXY7OwyNI0dq0JrFq/3bEzyFOLj226onQpN1QVulN4wYWw3REKsq1I8jj2svIGiQBW4e770nwNFOlXm4BGJdMpsnS5s1dFIiGDp7GBt64kHK7eBDh7NBMk/ZhDprMTlyrGcvdhLGjg5+zBTeu14aNLzkB13w6Obi6bF5xYrNB9fgyFGdjQNHsjIzZe8CQx+pK1BdTw1CjAe+mDgOFM/fNYtd+YAI0z/CIBjIeMukN3RmaZZk6XA1mUfdfu3p7b1ixaefrvCgBSgyVAV1hU7x7ORMsfPeew29BUK0C55sPChK8IBascHtNnBAyK9cTEcVtHr8tp0cqVVflWOTIlr9t0PbRRd+7AMa2EEgBOJnVnzyKTB7u7lcx5EjG8SRKFck7p2DJhUtwLkwiPKHxa1NC1KQ1LQOxLhJ4N+R3De+IySDmkqJ1GbTVlW1aPUX1epw2iPrGLcmLnRv73VvfPLJJ9jOK4Q/EEMJXVB3ZG1CcroiYZYZq4OdAAl8i0rB4zDwkExTeX9HheX6ITZ1nDJa6OYCSxIcLEFE7SLzLCMUqNAw2nxaDMZH03RDHoT0boHoZbr3M+ve+NOf/kRSr3jP7RiE6ADwwgR2uiI9bZ6hk3C8y64mFQ0n84G5sLIhGBxZqbiiUIjFYt6JDcH3nww1LlXDL2j1JpNWj0N1/bdD531A6tiFTn8Gr88+I6GxOjx3BWNDC4SN6TKlPGXO0Gmz8S41VbJ4zVF72+22hIDAEa3EAiFX6vngXYtMQbI0FRpNVj8eleXMaLUGfn3lw6EbrrkhdPm2iE53feavz/z5z3/+7LOXHNDewt9CXlFt4V3lKVSK+LQF6oDyruQwdOUnaJKdiyA7ho5uQakkLwYXMx6YIDRIYxzVumu1NqvPCKEhHgLt5oa/8v+Rznb921/++tc/k8yfUfIAdXh+wKfmoUoZO1GeOV8dz0HsKBKUQWIJ/nAu3NptrlmDTzqW8ATNznydd3X3lZf/0eXYQ1JMNKjaNDraKjWirAdA1+Zhz7s8IdrKdv38b38B5mcoQ9stvWLFS3IaRFnFdZ6MnZyYxOYl3RM75HVkBl8w+2rIE1zLAyvTRCInvETneXhOototZ9O9T7OdKlDWA2OYURoIfYePj8EwMrgo9DVcS0W6uLBPu37x+d+AGagXQn/yibfbsRNxypO5cijuoCHMLJqFdsaSTi/JBXWI18zzKE6H/RuRSJ67UbCxLne4sERw965ArpLRXeneIheUp35I1d1pzamqwnM4zn3Qmry3wcgMjojN3v8FRrZDL5THJy950vipSlWZECfDxJS0hICUhQHvbvVJZeqGd2ZtNygFy966xbkFRs6FlZ1dUlhYUlKSXXd4t5c3ne5NF15++E7lBS04ow+EkKl7oBmk//JFX7PDwr78wvXzzz+fhbZb+o03SGhvF0gMSrLqwIbe68xLWJAOQdInv1IEveOYzUHudXISUqooKio6AryF2XcBOndYXubl7erqGvGyyOUhfUJteIDWFmhEfOjLZ6FvQgYgAHnQTQQUYV9++eUX86D/+lfS1LMhb4WHcRcEjUxhITZ0EiTwIvGcH9oDniKVNs9QtCmRUCAUCOrq8Kw6m7K0oLrgVeVVkAcdsEHUkge37OGt2hg+fySgZQ7anof4L7JXpjg7O5PMX1DMDmjAfsaxPIWX+alfqcrqsDrIpjDJkcZJP1wLklYpNkgdg+UsAhEiJ7m8sbGwkFRFYWGjUJ4rGC7wwhnRGyQtc3LioLyHtB5SrS3GYIMGdVYelYK38wgRe6UztX5IQlO2Jpfr7Dp9mk2nOxHo+6nKk8N3KXXgeFcgm5daIEpDP7uBNitpSCRCJyDGusgWCITCXGF24XAuz+swLvS2hp12Cu4+Vj9vNq+5rwTiWLVa96qcszGzjgiHOOj0XFqaHdo5af+8heeIiWw2++uvvwZvEkk5RD0DiRWqk7nZ6XZ17N3LVqbMBg/I4Rj6+7Nv+Raow8mpETsgmBkMjuGHA1QKsRygr3ifhtAx36pZa+4XNd6L0WpNFzvnSlOai9NKZzzKSgpbSS2gXAuYX69duxa8Z0p6i9NBEGoq7tLqoc2CWgkCXvJzKVQrq4qfq6WLsstUCkXQ7E7QNcRxcioszBYKs480FoHFs+8KclXQAyhUWB6rXYRIMGfcvDxyyx3V39N28VsDL/D5/f0U9Nvwmr9b6YDE1sT25NzicIzGbsbl+Zv3UOBWXMuiWpYy3ILb1bF3bzovjYJOjm/kXc0Aoui5CgbdguDReEQ4LKweFpaAF9bJgTlOpVJiaLGIz6DNMoMfGEUg8IWDNJqk44LhYuBFg8FKs6dJDl402jGim8GIjLyvalojWXPtWl7eMSKrFu+IQzDg45bFLml7fFY6701zTk4vUF6HPJdxXZEaPd9Qt0SixiJwQCyRQiGUgDiBq4ZxbZqh5NOg4s7CbngNkCdcnL4G6GP3DK07rbj+yMnJeVDt0dDw9hoa7TbjWqVm4RXE3famPwhXpZSkHWXHkasyFU+pFMtgyTNVqTxa5IJWYkIuK5HXZQuzhbl1ciVV2inxo0IhF5G/9WOaAOhETmwnkeT+orrDBzKiXm+zOqDV1yoqBHm1sLKyHlym6mZnCWs2QGrJLUkn06EdOkFxZGsiOZSOb8SVB2+BNwloyOiUXtTYKBQezh1WOupR/I1cJo7m83fRJtBlNCECK4toCN3bCxD/Mm51t10c4XBGHrVHzGrQYeTuY+M04S9+IUDPnoTUkotTy8pZ6PhMu6Yht0BPqzj57Pz9+tqsDqlIWJReKCxTHbYz42oJDq5RDMZW8GTYmZwSnEQcyhfvga6kWX2gRUSXiUeCFgioX3OD+Orx3gpowyMxdEFdoyO1kGurbLZtIaFVaxAx/7TRaJBh5ALhdZWKQlYooQW4Uq20NwKy/XRYool5Ubpy/t+Pj57VG6QHDz6wGydmNdXQRfJ+IPDw9PB8CYg/XfHpr95ygyResCB47N3beA80WNrhS/aiggh0chFC2CF3zb9fRtkbXin6qvJKXBz9ywgPJxfcejwAih9oDYSzsKCeJhbIHmmuCX5MdTxCD2jBPec62k83/yB4XsRzlHey9Pug1zj2Iyqh+2DcVHPc8IAGW1gJPmuXSNyJZyNPFm395f/7ki5goAbGAzc1ULjRGK5eOGGaOxUQfKjeEBpwkRPUjevWvWHvZ3F3uOK9j4IVUHlkL4Qu2LoQGhzxHqfeNSFW2EkBG/NC/MiIO/EhI9iD7il/WS4U5D1wwyBcAwf+E3X4+GLyyHN7gToyjgs04BH2fpYs/lesoCzt8QOAfrUse36YnoNOtEOL3S6jSjIzGfkTNLfb/CBxqsMBFSQzzi8g6CAX0S9+8Us55K1jxMNvayAW277I+3EDlkS3mxs0s/QI14i/2It/R8NCQXv+4PvkOCw9PnkedGaCPY1DOS3ElWn0h+AZtyVB56mLgBSOxltJGZmK0fB9kdPXQga0pG7fPuRaAA2HwKA6WchH0MuyXV0/j3CU0VD7f2Yfd2B9kNCpi0AnOxqXeFx7XFEEfPQOP+hE6uyQYNbMccrr0IErM8kDEAshyrmhyEefz1HXAF97+zZZ21x2c3Fin96//4uFtf/90C84oOfJI02VODdAyMZbLdENQbzrV2ZhZ9WMseE/su5YffdnLiJ8kdlDaulFoCWUhCP50HonQsviaFi2ze+yMLTDE+dbeh50iuq5udK0BFpEhVicqrQHYWBVzgZniplUtKJMrAANSYil7MiQZToD6lJ24v4U5zBHk3Vfa2i3NDlaWrHCg4S+xxH//9WUeU1AbgCINfVKhkPGCoc2yKPADyoe9fyGNceOoQcPDxaDbkC3Xvx65XO4x7I3WXZDRzwE2rMhWHEfdDLVBZDtllNhbuZXcUpqmnOCt0DVEOBlPGxp8mDiFAENNyvRkhYNTUGL5WhYvpztDe9taF9aMU8eK95DZHIRLojTCUrnufEjQPOOpPI2BAUF8QUb7HFD4Qh3rzoyN5CnSsKPLXEvgiZa+xxuWPAlA0lJ0GZBn4XJ97u6fuFqtzng41iNG9s/v/TS/8XyoLngNF63EFqVNm+EkFu9VSZ7FjXQPqTRTmCXUyjnZo2gbEo48JQYtxa0g0uC/t3vVs6u5+wrhVpJcyssjOoWyb729Om1Ey64YMpdUDDF8+YPa7JzqwO2vkgcg7KDFrTh5EnF9esLAl9GNaZeHacIwsEua2mW5nBc7OvZe9aL1IIWEVow3CqS4zeRk8jFRWQvTeXxs/V0SrKKsrR90otnCGIxDV922e22xs0lddbG1KP45dXw5de/VAWjg2ip8niES8Muw/+oNRhp37jc6YabgOFCLgmd4hwvu6qUXZXNeWL8ETye5jFQZC2VxRiKhWFE7OHhxeO97Jnugq4tGRovN/taA+sHH+EvLzS88EIDrMX+pOsF1DCIIHxsGRZ448vB5CqeWJaYtjcl89VE+6gXcqKw7OSVVGqyn/X2MeKn/NT5zHFxu709fyb39nSiPerNT9/9YsJaPH4s+JlYrFKqZFvtc17ndHGCY1s8vWQ4QKk4sYbUK3HzdrfbeSpazEJ7eopcPD2dHuPNHxNag/gn4vBmvarMKXHezgVbKXOmZr3xchB1aiot8qfH3m6o6EDIJWg+s0Is9/aWd8vpTxF6EO06Dwi8Yaf5/RasRJ44aW/KShz0ssu8lKAPBmIwfjLoIpJdp5hTeWLx+Q18movcuxEJnERI96Sh//jHP+p0q1i6txjo+7gdFy6s87Ciy5QJZKGXXog3XcQMJHJychGx6TzeVTgzvOgAUMw/vQPlr9BbVIlotCdl6awsAeOtoQMLxh+QE5X3jJjswva+0pi0PzmBDtCqDEUw7nxgyYOEPMiF/DWO1knNEDkRj3eeHwatycvL6+rKm02yWRBnBLA8YAkYNJ6jH0+cDx0WFkb3evk0tGjy3fJf7t69W0g/FEF3cqlAvOtfxZ13Ix0ziwgnI1c90mQtG7TmmpvbC7Px7rL6GJ4deFJr3Qq83utA5+07AQv04YwbnkOn6Ls3b95MWpjnRT90ymkCoWDedTzdy0Pffd0PrXl7lnbCzc3FhTq93vZp+mf2DbnNnGPB5NUpRQtGH3vD6PR938Nr36l9++in6Kd287zpdKefvIWCTsTFnXchhwr2aUZW3nJBk9MoBl8kevHFrVBluELVRNV7zzj2iahGUc6QnOA5MrnD1GFhEadOfe97mzd/79ShQxH7ToG1Pa/wRE40wg25nIyLC0ZqfHcCQSy3pQmXtezExDCokagmhqysZ+tq+9bnp594H7stxvogL0GwmzotzPXUvu9txnbG6xQd6OneorUTYF8JLRXU0aAmll8eeYgTuHLeDgZZm24j6+qF0J/+SoiCcFKkXNFu6jRXsDBoGCMfOrV59+ZTp+j0lU4TEihXghVxvF2MCrT80BqAdvr6a3biypVkNer6hb0dILeJqL1P+xzBg+HGS7VfCuQwtXNYBP2bfWDnQ998A9qAb+h01yK8I0CgIIh3ux734rxvjx5GDkdq3wjGV8efJpXtGoE7gXXr3lhB9lx2U1+3b3BR1CAPOmllgMbyAHy661aeIpVPY9SKFeJ3Fg4Ulw96bovmMnGTmJjgczgi8gjobHJfC4/InnkGgt6v3kICfNVVLnnVFbnxkkI/RN8HweMQZj4E2N9EuIY14ktNbx9D4hMTqB6h5YcmyBazUnI778f3Tv+M9nbh179++WUyANNFHQ1ifJFp3RG7qdPs8e7Uvuf3ffPNvuef/+YQff/L5EVB4l3GDXykQU8EOnJh9s6qzcsTXJO45S0srBkVNLcP3NxoiEZe4IYDCEnt7Eo/BF54Cpifx8wRcHaKhMP48unzLlA4a5C6+0lpevGUfo0hycPr467Zy5DUblQAKYwnRwnOYa4RhyKwmr95/ptvnn8+gk4nx3ryLapUhezZyw1IQ25YHXxa0Iv9Kb4WkbwuT2D3xf3giIdw9AArA3MEfX9iQkK6TIhvF1EG0ySriFr0NC19r8TJSxUHJeT8I3O4xC4QbOp93zsVAZZ+/tAh1zD7jQzCMlBIqhiKpbz6vwd0lCOevxWJBAKGAFG+WIip90MWjaCfioDg8U3EITo9zNl++0VhbnUAvpto+IVIxt8B+mjU/A53Ixo6E6XE1xMKGkHWyftdISZGgK4hbpw6HWZvF6mbc/CNAUqhH1qlQw1PGXoTi3rs6clvpqYJfm9mpNojCDs5eT/bFaBhRbjuTyNnIAuoM1bDQQuetqV1+fkIbQT4Tcz8PDQUMoRWMb0w9XA25YxJrlBOg5lPs6nBnnPSD+036EAfo8zI8HoNjA1toY7VrHta0NuZR1Gzve8aGmo6emZjT4+vF3UfA+mM+9nQtLieTmHL7S2jM2Vr7pG7uZmZqq8yvlr9WsPHaGgVq+npafoMQqyjLJSvY7Lymc2bUP5x5OeRQVJTISRs/+n9Yc572eK0WWrS1tCdC8pIiWR4gUZWPe2QdxStGmpmIhaougd/8XsXqDML6uyZMQkXT8kqx4XJjjuL4tNL6oYLXsUaAWv/kx+KfDRwFuu7Q+tQV/Pr646zjjb5ehxFlwD5EmK+mXEFbC0gA1/icxiarUxIW0iN3TE7tzoT32Ubl+H1MxyHhvAWtg4/PGh1LY+ld6D3LVxPFLKttDc0BOTdxGJu91udkaHMLBNiatLY6WLe1S3spPnUpLEBu4y8oEaR4bX6zdf8/KiYtAov3aqNAnjYvnHOQJd6oqIOfEdonW7TpfyNqK0mto0Vuse/nNuO/IaOYmswgVq1payuhIx8CauVW1MSZapX052dHdfq7SeNHd+YzVMoyNvd8S37Xl5v/tyD+RBphLBCcD91YKfucaGbm7uYTcfzmb0+Zgu31Me9prctH/U0n0EHdEywNQ+nRihD4mUZqgRcqSYlyMUyytxpODkmshMSCq9mXD08XFaQCdzXKW6v1bDeffe1qKio11579z/+4zW7l+oQ03d923TfMshDx3q9t8Z/z40B/2KLpXea2UOdze3/tDoDLFhwOFt+NUMMEsFVX1paYrqXOB3fsENKJDFZxrt6xLuxJDv3cBkEQGzwDGp9ZV84krMAmhTFOq65vHR9Xk+fx7p2dODxoHWbUMMBxGRt48b6DJi5nm2l5cXrQ/6zJ/8M0tViXSuUXplXFUo5vlGHdEgwdwpbpsxkp5DYCVcVMjaWdtGREiFwF5Dg+JMRlNeVyq++4vEUcV4ezO3AfAaxmD3c2Bul3GnE8t5i8UVRjwkdgpV1ifX6tmJz73Sf57mxyXIuE3XhsIfeisLemJERp6wWyrwp7P04+oG5ZVeV6c5709LjMpPt0gbuwpLsutzD1Zjca4v9Yx3APX2Z+VQf2RTiG3uD+75ve9S0hWvxPdP1XeSRz+x5PTS0D/meGxu4wbWsD81HTYjZ04Ui//CmV1xcBkhEWFLExQUUFglpbuf4TJ4s82oCmR9xICG5SfDs3Nzc4WpSLCCVN317cBhtbkY9GrTujj8XDO5Zalnni/I3fpeQF7Uxn8UCJ7GMDZSGPgMKaWM1dUGugbPg5wF1iBKiSG42vm81nroJG2eblKSEq8okUAjeM/vhLDeAy46U3L07XLaFLEw8/LajLh12HNR8nOV7x3/PdJ9vr/nc6whB0aN7POgh1MxihWxCzT1d683lxdte596oMRe3tZPpoakJ+TGxsFWvBgzXlRxJn7t5fP/+pBSZyrG/90N8N3ky2yGTu7llZMbJWO3BXIVwAGT2oKPN+az23vKxUktvbGzb8Z78JubjQusgqfqdYWLnbqupsayzmM2lpTVmS09tDyLTOtPvNa8MxXXVyQI5+VkIdm5YiTIlee87CYwNTSIfyRbkVhfgT8/AZu6xvwkUNLieYk4XD0yO1ZRzfdGl/KNNjwtNiXoI6aJ0YOnSc7FmS1vp5AC8KsrLJ2uES3+IAmPjuzIKqnPvgrkpbiCXibdiWjb+gZJGUWF23TBYGVqxjIx3fT+OcmBthPDP1B3vYa4vNo/57wllRn23OH3mKFYX+n1IH7cmtsbMZU7fmPS34BTQ3t6DrbSKVHbGV0pVZmZZbh1wF6VzMbiMxyVZ4ylgIAYjk8gQc1Z7+sFBU8zMfFwrIIBmsfpCYYU0nzlwZkj3+NAHNuFX3aiLYq1r67VMH3/dUnPHwoUQ6NuE8smjAlkyfw7YGUqVKrOg7HCuAH/KR1G6XCFLJxe+qBfSC84vW6h0DspgrsKFLhXr+vraARuCiO4oLkxQPpOFFmwnPU5pqmMeQJuaWQCHWKHFA8WW4ppYcym4447tTMgzDTiMvOn1VYYCSr9Xt5AfAJObfbdaIRZmQ4jLFgpyycSyBUdmSIJgZSY1JIIOA47cg1ts8WTCD8C+w68B+TXfW+59h7lHUxT6N2ZbjXtprN0dfXXoOKuHdKXtDWBtXkYG9VE7mZkFBdUFiqvD1XgBb8BJDHwFjMx7M8rPz1FYH206gzYyPcvda4otfaiJa/FAaLEdu8eH1qGNUai9eMDd32zZxi0dmKyxTMNpbcaXpOYjHLs8VnspyY8IIj/SSBWnzMwMyHR8pBF4q8Jr9c8bGnDW7sKVRRMI4lIXava8M+M+6c8NXcfltiHm8k6YurqAra+33Fy6nrmOW15eeqMc7HM8/9/IbgPIt/f4+Xq8uwXsnUHeLUVeAwSCwD/i8u4fPDxwk4vyodDArS5ZikI+7Cse85+cHNtjsXj7ouZlHovB23U1TZ9re0V3nOs/OVbMjcWJ5jgKuTTU1MTMh3TQxEK+r3h4e6/2AoVn8HiOgg7KaG/vj1/BVgzB/W3IJTIFeKznbmvPQ32W8ppY/0kf8zbm8s/y8s+8pTvKZIbo+tpAJDWxll5//0lz2/u+2GZ++U1DXcwecHvWH/xe8fXwiPL4B3K9GxXl4bnO7+OPEXk9NusMdPSrmpp6dO1cKESLQ9G/Hw+9M8blxpq5fWhH/oFlhibPJ4s11Oxd7OPONZvbvLlj7uXc3uJp33acZpqOQjA4Y88LB5hMP2ox7fbLY5I7cj3tzE1dKISFPO/U+MOLhEBw6q0p9W4DV+xhLtLVfld56JhHm1lMXWjpANQIFu9tvWPuNXtqxvb0WkL7cIjdcUnH2oh0B/KGFu4Yrho6cMAeFKA+Z4ac8VjvEbK+3L+0uLTUMwSxLOWx4B0o7/hxnW7ZoRELHT+O8n23ldbUmGN7ubH+Y2b/GmgeIVVa1mFn3Ll9CB0gTzGgd+GV58Dt2nEAnwdcpPdx7xR7cssn/ScHBoo9kW598bnQEL+uA9vzl1XTZGRthhrmaL4OKtXQc2aIIjdiS2vGxm5we/eMuY/dKba0vd8XQimha+jSJZ392x1DUHxuvET+1N7uMd22PmT9HZ+ac9zimvIx/7FySztqDw3NH/Jb9vn0JlLQTTrU9DpL1xSl87VAwwj2hW7X4uFbDO/uMwMgUJS069qPz44wNtplgkNGOzO/ydeTa67p9Q294+9ew/W0gMZuAHS+w2NCWE9CHvDaYDYW4Bz3tfSWF3Pd3Yt90SuQ2s/1+lfVcP1rzG2eEMfaffv6QnYAQFP7cV/fdlZPO+ByuaFcc+yNmjvTvmZ//3+GDv+OuTfWvK1H95u8HbontH2xIPzlk8a2DNRwUbulvLzNw+I/Wco1u09y4Vgsvb2x3GlI8u2elt5ibu90yPriGnP5nXPFA+B83PV95pqxyQFzaXm5udjyCsSdJ7fnssDgQztZr/cxp0vhPdcXD5S+gqbN/tx1se6TUBGXguAhXU435TN7wUfhp7beAf9zwFha7v+/y2t622Jr9uyBBr/0nCW0nXVcN/R0oJuONm9iwckP9YVQ4D9Q2s5qK/efbjP7u98w+5cCIffGACQLJheCYyk0l+Vj53zbzAOlxXfGoKUvNfufazPXnNvmy4S2pZ2Jngb0mWbcDUHIbmblMz3O1YBG+ooHbqwD6JoZ/xvmyT2eHqDzV3QhcCjFljs1GHq7b/EkRMZz3NJyMH4vlEeh+ToUxQxZfOi4/NBNpHF00EHno6OvcC2e0Nf43NhWfKf0xuTAjfLJ0pB2EMQrKGS9eXIMVAEx+VzU7wG6NDa2F/q20mILMxTSaE/z73WbcH+oewryyKeqaBbeiTmKQpjt7dxi8D9z+Tmze3npncliXV/vgNkDsdab3f0H3Eu9zf9cPL3OPAldZmzsneLp9ZgY7YDWOIRq65+Kpu3RGzdMLOZ/wte+tjYcwizAug2UEdoGQvdFuvfN7ntuDNxp6y0vLy4ur2mD2My1hGLSM0M7UM/reFCjO8B6etCQaVhkDXVm4ybIDyF9R6ct0Dr1gseVm+9MmqfRcfS+ebKYax6ItVjMUMdC8uvz9e3bBF3VEMCi5mayrIbz9qTlMb94HNre3DxEDrJ7cM/eAxl5G8QTS+mNG6VtzKF83bS5huvNLT3H9V1/jhvKtDcmUAlstE84oedi4abg6ckDwnVzPlXksOCbPOqIoBcJXb8+tAlBwfc+ty2UeRyPAlFTCL76KP9SlB82LtmJb29G1MznqUIvch7ykONSPPKUhNhP/M4dcDR5T/8qhCWMAH+D0G9IZsD896Gu3+wADXUdeOzX+y9RfU8FjoJligAAAABJRU5ErkJggg==';

function makeFabricBump(){
  const c=document.createElement('canvas');
  c.width=c.height=512;
  const x=c.getContext('2d');
  x.fillStyle='#7f7f7f';x.fillRect(0,0,512,512);
  x.globalAlpha=.28;
  for(let y=0;y<512;y+=4){
    x.fillStyle=(y/4)%2?'#a5a5a5':'#5e5e5e';
    x.fillRect(0,y,512,1);
  }
  for(let xx=0;xx<512;xx+=4){
    x.fillStyle=(xx/4)%2?'#929292':'#6d6d6d';
    x.fillRect(xx,0,1,512);
  }
  x.globalAlpha=.2;
  for(let y=2;y<512;y+=8)for(let xx=2;xx<512;xx+=8){
    x.fillStyle=((xx+y)/8)%2?'#bcbcbc':'#4e4e4e';
    x.beginPath();x.arc(xx,y,1.15,0,Math.PI*2);x.fill();
  }
  x.globalAlpha=1;
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(16,10);
  t.anisotropy=8;
  t.colorSpace=THREE.NoColorSpace;
  t.needsUpdate=true;
  return t;
}

function cleanKitColor(value){
  const v=String(value||'').trim();
  return /^#[0-9a-f]{6}$/i.test(v)?v:'#0b4bd8';
}

function drawKitHalf(ctx,left,base){
  const w=1024,h=1024,color=cleanKitColor(base);
  ctx.fillStyle=color;ctx.fillRect(left,0,w,h);

  // Light and shade are transparent overlays, so every chosen color keeps its own hue.
  const light=ctx.createLinearGradient(left,0,left+w,0);
  light.addColorStop(0,'rgba(0,0,0,.24)');
  light.addColorStop(.22,'rgba(255,255,255,.035)');
  light.addColorStop(.52,'rgba(255,255,255,.12)');
  light.addColorStop(.78,'rgba(255,255,255,.025)');
  light.addColorStop(1,'rgba(0,0,0,.28)');
  ctx.fillStyle=light;ctx.fillRect(left,0,w,h);

  const vertical=ctx.createLinearGradient(0,0,0,h);
  vertical.addColorStop(0,'rgba(255,255,255,.12)');
  vertical.addColorStop(.30,'rgba(255,255,255,.015)');
  vertical.addColorStop(.72,'rgba(0,0,0,.08)');
  vertical.addColorStop(1,'rgba(0,0,0,.25)');
  ctx.fillStyle=vertical;ctx.fillRect(left,0,w,h);

  // Match-shirt side panels and shoulders.
  const side=ctx.createLinearGradient(left,0,left+205,0);
  side.addColorStop(0,'rgba(0,0,0,.30)');
  side.addColorStop(.7,'rgba(0,0,0,.07)');
  side.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=side;ctx.fillRect(left,0,215,h);
  const sideR=ctx.createLinearGradient(left+w,0,left+w-205,0);
  sideR.addColorStop(0,'rgba(0,0,0,.30)');
  sideR.addColorStop(.7,'rgba(0,0,0,.07)');
  sideR.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sideR;ctx.fillRect(left+w-215,0,215,h);

  const shoulder=ctx.createLinearGradient(0,0,0,280);
  shoulder.addColorStop(0,'rgba(0,0,0,.18)');
  shoulder.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=shoulder;ctx.fillRect(left,0,w,290);

  // Fine breathable fabric texture across the entire shirt.
  ctx.save();
  ctx.globalAlpha=.10;
  for(let y=4;y<h;y+=9){
    for(let xx=left+4;xx<left+w;xx+=9){
      ctx.fillStyle=((xx+y)/9)%2<1?'#ffffff':'#000000';
      ctx.beginPath();ctx.arc(xx,y,.68,0,Math.PI*2);ctx.fill();
    }
  }
  ctx.restore();
  ctx.save();ctx.globalAlpha=.045;
  for(let xx=left+22;xx<left+w;xx+=30){
    ctx.fillStyle='#ffffff';ctx.fillRect(xx,0,1,h);
  }
  ctx.restore();
}

function removeConnectedLogoBackground(canvas,ctx,rect){
  let image;
  try{image=ctx.getImageData(0,0,canvas.width,canvas.height)}catch(_){return}
  const d=image.data,w=canvas.width,h=canvas.height;
  const x0=Math.max(0,Math.floor(rect?.x||0)),y0=Math.max(0,Math.floor(rect?.y||0));
  const x1=Math.min(w-1,Math.ceil((rect?.x||0)+(rect?.w||w))-1);
  const y1=Math.min(h-1,Math.ceil((rect?.y||0)+(rect?.h||h))-1);
  if(x1<=x0||y1<=y0)return;
  const px=(x,y)=>{const i=(y*w+x)*4;return [d[i],d[i+1],d[i+2],d[i+3]]};
  const corners=[px(x0,y0),px(x1,y0),px(x0,y1),px(x1,y1)];
  const opaqueCorners=corners.filter(p=>p[3]>220);
  // PNG/WebP ya transparente: no tocar sus colores internos.
  if(opaqueCorners.length<3)return;
  const palette=[
    px(x0,y0),px(x1,y0),px(x0,y1),px(x1,y1),
    px((x0+x1)>>1,y0),px((x0+x1)>>1,y1),
    px(x0,(y0+y1)>>1),px(x1,(y0+y1)>>1)
  ].filter(p=>p[3]>180);
  if(!palette.length)return;
  const close=i=>{
    if(d[i+3]<=20)return false;
    for(const p of palette){
      const dr=d[i]-p[0],dg=d[i+1]-p[1],db=d[i+2]-p[2];
      if(dr*dr+dg*dg+db*db<82*82)return true;
    }
    return false;
  };
  const seen=new Uint8Array(w*h),q=[];
  const push=(x,y)=>{
    if(x<x0||y<y0||x>x1||y>y1)return;
    const n=y*w+x;if(seen[n])return;
    const i=n*4;if(!close(i))return;
    seen[n]=1;q.push(n);
  };
  for(let x=x0;x<=x1;x++){push(x,y0);push(x,y1)}
  for(let y=y0;y<=y1;y++){push(x0,y);push(x1,y)}
  for(let k=0;k<q.length;k++){
    const n=q[k],x=n%w,y=(n/w)|0,i=n*4;
    d[i+3]=0;
    push(x-1,y);push(x+1,y);push(x,y-1);push(x,y+1);
  }
  ctx.putImageData(image,0,0);
}
function drawLogoIntoFabric(ctx,img,x,y,maxW,maxH){
  // V913: usar el archivo transparente EXACTO tal como fue entregado.
  // No quitar fondos, no recolorear, no aplicar grano, máscaras ni filtros:
  // eso podía borrar el escudo/figura central de logos que ya traen alpha correcto.
  const ratio=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight);
  const w=Math.max(1,img.naturalWidth*ratio),h=Math.max(1,img.naturalHeight*ratio);
  const dx=x+(maxW-w)/2,dy=y+(maxH-h)/2;
  ctx.save();
  ctx.globalAlpha=1;
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(img,dx,dy,w,h);
  ctx.restore();
}

function bakeLogo(ctx,url,texture,x,y,w,h){
  if(!url)return;
  const img=new Image();
  try{img.crossOrigin='anonymous'}catch(_){}
  img.decoding='async';
  img.onload=()=>{
    drawLogoIntoFabric(ctx,img,x,y,w,h);
    texture.needsUpdate=true;
  };
  img.onerror=()=>{};
  img.src=String(url);
}
function bakeLeagueLogo(ctx,texture){
  // Frente, pecho derecho del jugador (izquierda para quien mira).
  bakeLogo(ctx,LEAGUE_LOGO,texture,245,205,205,205);
}
function bakeTeamLogo(ctx,url,texture){
  // Frente, pecho izquierdo del jugador (derecha para quien mira).
  bakeLogo(ctx,url,texture,620,215,190,190);
}
function bakeCategoryLogo(ctx,url,texture){
  // Espalda: escudo de categoría grande, centrado y separado del número.
  bakeLogo(ctx,url,texture,1326,700,420,300);
}

function fabricTexture(name='JAIRO',number='7',base='#0b4bd8',logoUrl='',category='',categoryLogoUrl=''){
  const c=document.createElement('canvas');
  c.width=2048;c.height=1024;
  const x=c.getContext('2d');
  const color=cleanKitColor(base);

  drawKitHalf(x,0,color);
  drawKitHalf(x,1024,color);

  x.textAlign='center';x.textBaseline='middle';

  // Back: player name + number; the category uses its official crest below.
  const cleanName=String(name||'').trim().toUpperCase().slice(0,18)||'JUGADOR';
  const cleanNumber=String(number??'').replace(/\D/g,'').slice(0,2)||'0';
  x.fillStyle='#fff';
  x.shadowColor='rgba(0,0,0,.30)';x.shadowBlur=7;x.shadowOffsetY=4;
  let nameSize=106;
  do{
    x.font='900 '+nameSize+'px Arial Black,Impact,sans-serif';
    if(x.measureText(cleanName).width<790)break;
    nameSize-=6;
  }while(nameSize>54);
  x.fillText(cleanName,1536,205);
  x.font='900 330px Arial Black,Impact,sans-serif';
  x.fillText(cleanNumber,1536,485);

  // No texto de categoría: el escudo oficial ocupa esta zona.
  x.shadowColor='transparent';

  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=8;
  t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
  t.channel=0;
  t.needsUpdate=true;
  bakeLeagueLogo(x,t);
  bakeTeamLogo(x,logoUrl,t);
  bakeCategoryLogo(x,categoryLogoUrl,t);
  return t;
}

/* Lightweight fallback shown only while the real GLB is being decoded. */
function fallbackTorsoGeometry(){
  const rings=30,segs=48,pos=[],uv=[],idx=[];
  for(let r=0;r<=rings;r++){
    const t=r/rings,y=1.07-t*2.14;
    let rx=t<.22?THREE.MathUtils.lerp(.46,.70,t/.22):THREE.MathUtils.lerp(.70,.61,(t-.22)/.78);
    const rz=THREE.MathUtils.lerp(.29,.34,Math.min(1,t/.5));
    for(let s=0;s<=segs;s++){
      const a=s/segs*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
      const px=ca*rx,pz=sa*rz;
      pos.push(px,y,pz);
      const nx=THREE.MathUtils.clamp((px+.76)/1.52,0,1);
      uv.push(pz>=0?nx*.5:.5+(1-nx)*.5,1-t);
    }
  }
  for(let r=0;r<rings;r++)for(let s=0;s<segs;s++){
    const a=r*(segs+1)+s,b=a+1,c=(r+1)*(segs+1)+s,d=c+1;
    idx.push(a,c,b,b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);g.computeVertexNormals();
  return g;
}
function fallbackSleeve(side,mat){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.20,.30,.68,32,6,true),mat);
  mesh.position.set(side*.69,.78,0);
  mesh.rotation.z=side*.9;
  mesh.rotation.x=-.08;
  mesh.castShadow=mesh.receiveShadow=true;
  return mesh;
}
function buildFallback(texture){
  const group=new THREE.Group();
  const bump=makeFabricBump();
  const material=new THREE.MeshPhysicalMaterial({
    map:texture,bumpMap:bump,bumpScale:.012,roughness:.8,metalness:0,
    clearcoat:.01,clearcoatRoughness:1,side:THREE.DoubleSide
  });
  const torso=new THREE.Mesh(fallbackTorsoGeometry(),material);
  torso.castShadow=torso.receiveShadow=true;group.add(torso);
  group.add(fallbackSleeve(-1,material),fallbackSleeve(1,material));
  const collar=new THREE.Mesh(
    new THREE.TorusGeometry(.33,.045,14,56),
    new THREE.MeshStandardMaterial({color:0x60dcff,roughness:.72})
  );
  collar.rotation.x=Math.PI/2;collar.position.y=1.04;group.add(collar);
  group.scale.setScalar(1.18);
  return {group,materials:[material],texture,bump,uvChannel:0,real:false};
}

function disposeJersey(j){
  if(!j)return;
  const mats=new Set();
  j.group?.traverse?.(o=>{
    if(o.geometry?.dispose)o.geometry.dispose();
    const list=Array.isArray(o.material)?o.material:[o.material];
    list.filter(Boolean).forEach(m=>mats.add(m));
  });
  mats.forEach(m=>{
    for(const key of ['normalMap','aoMap','roughnessMap','metalnessMap','emissiveMap']){
      const t=m[key];
      if(t&&t!==j.texture&&t!==j.bump)t.dispose?.();
    }
    m.dispose?.();
  });
  j.texture?.dispose?.();
  j.bump?.dispose?.();
}

function normalizeRealModel(group){
  group.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(group);
  const size=box.getSize(new THREE.Vector3());
  const center=box.getCenter(new THREE.Vector3());
  const scale=2.72/Math.max(.001,size.y);
  group.scale.setScalar(scale);
  group.position.set(-center.x*scale,-center.y*scale,-center.z*scale);
  group.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(group);
  const correctedCenter=box.getCenter(new THREE.Vector3());
  group.position.x-=correctedCenter.x;
  group.position.z-=correctedCenter.z;
  group.position.y-=correctedCenter.y;
  group.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(group);
}

function projectAtlasToUv1(mesh,bounds){
  const source=mesh.geometry?.getAttribute('position');
  if(!source)return;
  const uv=new Float32Array(source.count*2);
  const v=new THREE.Vector3();
  const spanX=Math.max(.0001,bounds.max.x-bounds.min.x);
  const spanY=Math.max(.0001,bounds.max.y-bounds.min.y);
  const midZ=(bounds.min.z+bounds.max.z)*.5;
  for(let i=0;i<source.count;i++){
    v.fromBufferAttribute(source,i).applyMatrix4(mesh.matrixWorld);
    const nx=THREE.MathUtils.clamp((v.x-bounds.min.x)/spanX,0,1);
    const ny=THREE.MathUtils.clamp((v.y-bounds.min.y)/spanY,0,1);
    const u=v.z>=midZ?nx*.5:.5+(1-nx)*.5;
    uv[i*2]=u;uv[i*2+1]=ny;
  }
  mesh.geometry.setAttribute('uv1',new THREE.BufferAttribute(uv,2));
}

function materialForRealModel(source,atlas,bump){
  const m=source?.clone?.()||new THREE.MeshStandardMaterial();
  m.map=atlas;
  if(m.color)m.color.set(0xffffff);
  m.metalness=0;
  m.roughness=.82;
  m.side=THREE.DoubleSide;
  if(m.normalMap){
    m.normalMap.channel=0;
    if(m.normalScale?.set)m.normalScale.set(.72,.72);
  }
  if(m.aoMap){
    m.aoMap.channel=0;
    m.aoMapIntensity=.72;
  }
  if(m.roughnessMap)m.roughnessMap.channel=0;
  bump.channel=0;
  m.bumpMap=bump;
  m.bumpScale=.0055;
  m.needsUpdate=true;
  return m;
}

async function ensureRealisticModel(){
  if(window.SHIRT_GLB)return;
  // Important on Android/APK: this model is ~1.4 MB as an embedded GLB.
  // Load it only when the user actually opens the jersey editor so the whole app
  // never blocks on parsing the 3D asset during startup.
  await import('./v893-realistic-football-shirt-model.js');
  if(!window.SHIRT_GLB)throw new Error('Modelo realista no disponible');
}

async function buildRealJersey(current){
  await ensureRealisticModel();
  const gltf=await new Promise((resolve,reject)=>{
    new GLTFLoader().load(window.SHIRT_GLB,resolve,undefined,reject);
  });
  const group=gltf.scene;
  group.traverse(o=>{
    if(o.isMesh&&o.geometry)o.geometry=o.geometry.clone();
  });
  const bounds=normalizeRealModel(group);
  const texture=fabricTexture(current.name,current.number,current.color,current.logo,current.category,current.categoryLogo);
  texture.channel=1;
  const bump=makeFabricBump();
  const materials=[];
  group.traverse(o=>{
    if(!o.isMesh)return;
    projectAtlasToUv1(o,bounds);
    const originals=Array.isArray(o.material)?o.material:[o.material];
    const next=originals.map(src=>materialForRealModel(src,texture,bump));
    o.material=Array.isArray(o.material)?next:next[0];
    materials.push(...next);
    o.castShadow=true;o.receiveShadow=true;
  });
  group.rotation.x=-.015;
  group.position.y=.015;
  group.updateMatrixWorld(true);
  return {group,materials,texture,bump,uvChannel:1,real:true};
}

function updateJerseyTexture(jersey,current){
  if(!jersey)return;
  const next=fabricTexture(current.name,current.number,current.color,current.logo,current.category,current.categoryLogo);
  next.channel=jersey.uvChannel||0;
  jersey.materials.forEach(m=>{m.map=next;m.needsUpdate=true});
  jersey.texture?.dispose?.();
  jersey.texture=next;
}

function createInstance(host,opts={}){
  const width=Math.max(280,host.clientWidth||360);
  const height=Math.max(390,host.clientHeight||460);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setSize(width,height,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.04;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.replaceChildren(renderer.domElement);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(30,width/height,.1,100);
  camera.position.set(0,.02,4.62);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;
  controls.minDistance=3.05;controls.maxDistance=6.3;
  controls.minPolarAngle=Math.PI*.27;controls.maxPolarAngle=Math.PI*.73;
  controls.target.set(0,0,0);controls.autoRotate=false;controls.autoRotateSpeed=1.75;

  // Neutral studio light so the cloth normal map reads like fabric, not plastic.
  scene.add(new THREE.HemisphereLight(0xf4f7ff,0x071334,1.45));
  const key=new THREE.DirectionalLight(0xffffff,3.0);key.position.set(3.8,4.6,4.8);key.castShadow=true;scene.add(key);
  const fill=new THREE.DirectionalLight(0xbfd9ff,1.35);fill.position.set(-4.2,2.2,4.1);scene.add(fill);
  const rim=new THREE.DirectionalLight(0x52bfff,1.9);rim.position.set(-3.5,2.5,-4.5);scene.add(rim);
  const rear=new THREE.DirectionalLight(0x3156ff,.8);rear.position.set(3,-.2,-4);scene.add(rear);

  let current={name:opts.name||'JAIRO',number:opts.number||'7',color:cleanKitColor(opts.color||'#0b4bd8'),team:opts.team||'',logo:opts.logo||'',category:opts.category||'',categoryLogo:opts.categoryLogo||''};
  let jersey=buildFallback(fabricTexture(current.name,current.number,current.color,current.logo,current.category,current.categoryLogo));
  scene.add(jersey.group);

  const floor=new THREE.Mesh(
    new THREE.CircleGeometry(1.65,64),
    new THREE.ShadowMaterial({color:0x000000,opacity:.20})
  );
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.39;floor.receiveShadow=true;scene.add(floor);

  let alive=true,raf=0;
  const render=()=>{if(!alive)return;controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(render)};
  render();

  // Decode the local high-detail GLB and replace only the jersey mesh.
  buildRealJersey(current).then(real=>{
    if(!alive){disposeJersey(real);return}
    const old=jersey;
    scene.remove(old.group);
    jersey=real;
    scene.add(real.group);
    // If the user changed color/team while the GLB was decoding, apply the latest choice.
    updateJerseyTexture(real,current);
    disposeJersey(old);
  }).catch(err=>console.warn('Jersey 3D realista: se conserva el respaldo local.',err));

  const resize=()=>{
    const w=Math.max(280,host.clientWidth||360),h=Math.max(390,host.clientHeight||460);
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  };
  const ro=new ResizeObserver(resize);ro.observe(host);

  const api={
    update(data={}){
      current={...current,...data,color:cleanKitColor(data.color??current.color)};
      updateJerseyTexture(jersey,current);
    },
    front(){
      controls.autoRotate=false;controls.reset();
      camera.position.set(0,.02,4.62);controls.target.set(0,0,0);controls.update();
    },
    back(){
      controls.autoRotate=false;controls.reset();
      camera.position.set(0,.02,-4.62);controls.target.set(0,0,0);controls.update();
    },
    toggleSpin(){controls.autoRotate=!controls.autoRotate;return controls.autoRotate},
    snapshot(){
      renderer.render(scene,camera);
      const a=document.createElement('a');
      a.download='camiseta-3d-liga-juventino.png';
      a.href=renderer.domElement.toDataURL('image/png');
      a.click();
    },
    destroy(){
      alive=false;cancelAnimationFrame(raf);ro.disconnect();controls.dispose();
      disposeJersey(jersey);
      floor.geometry.dispose();floor.material.dispose();
      renderer.dispose();host.replaceChildren();INSTANCES.delete(host);
    }
  };
  INSTANCES.set(host,api);
  return api;
}

function mount(host,opts={}){
  if(!host)return null;
  INSTANCES.get(host)?.destroy?.();
  return createInstance(host,opts);
}
function apiFor(host){return INSTANCES.get(host)||null}
function update(host,data){apiFor(host)?.update(data)}
window.LJR_FOOTBALL_SHIRT_3D={mount,update,apiFor};
