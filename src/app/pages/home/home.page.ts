import {
  Component,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  QueryList,
  NgZone,
} from "@angular/core";
import { GestureController, IonCard, Platform } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements AfterViewInit {
  people = [
    {
      name: "Max Lynch",
      img:
        "https://pbs.twimg.com/profile_images/953978653624455170/j91_AYfd_400x400.jpg",
      power: 0,
    },
    {
      name: "Ben Sperry",
      img:
        "https://pbs.twimg.com/profile_images/1229134250936619009/69BIVjru_400x400.jpg",
      power: 0,
    },
    {
      name: "Mike Hartington",
      img:
        "https://pbs.twimg.com/profile_images/1084993841898446849/DJ8XtR6L_400x400.jpg",
      power: 0,
    },
  ];

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;
  longPressActive = false;

  constructor(
    private gestureCtrl: GestureController,
    private zone: NgZone,
    private platform: Platform
  ) {}

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    // this.useLongPress(cardArray);
    this.useTinderSwipe(cardArray);
  }

  useLongPress(cardArray) {
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: "long-press",
        onStart: (ev) => {
          console.log("start");
          this.longPressActive = true;
          this.increasePower(i);
        },
        onEnd: (ev) => {
          this.longPressActive = false;
        },
      });
      gesture.enable(true);
    }
  }

  increasePower(i) {
    setTimeout(() => {
      if (this.longPressActive) {
        this.zone.run(() => {
          this.people[i].power++;
          this.increasePower(i);
        });
      }
    }, 200);
  }

  useTinderSwipe(cardArray) {
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: "swipe",
        onStart: (ev) => {},
        onMove: (ev) => {
          card.nativeElement.style.transform = `translateX(${
            ev.deltaX
          }px) rotate(${ev.deltaX / 10}deg)`;
          this.setCardColor(ev.deltaX, card.nativeElement);
        },
        onEnd: (ev) => {
          card.nativeElement.style.transition = ".5s ease-out";
          if (ev.deltaX > 150) {
            card.nativeElement.style.transform = `translateX(${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
          } else if (ev.deltaX < -150) {
            card.nativeElement.style.transform = `translateX(-${
              +this.platform.width() * 2
            }px) rotate(${ev.deltaX / 2}deg)`;
          } else {
            card.nativeElement.style.transform = "";
          }
        },
      });
      gesture.enable(true);
    }
  }

  setCardColor(x, element) {
    let color = "";
    const abs = Math.abs(x);
    const min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    const hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = "#FF" + hexCode + hexCode;
    } else {
      color = "#" + hexCode + "FF" + hexCode;
    }

    element.style.background = color;
  }

  decimalToHex(d, padding) {
    let hex = Number(d).toString(16);
    padding =
      typeof padding === "undefined" || padding === null
        ? (padding = 2)
        : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }
}
