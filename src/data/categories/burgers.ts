import type { Option } from "@/data/menu-types";
import { category, menuItem, option, variants } from "@/data/menu-build";

const fries = option("Add fries", 250);
const curlyFries = option("Curly fries", 300);
const extraPatty = option("Extra patty", 350);

/** Chicken burgers and the croissant lineup do not take an extra patty. */
const noExtraPatty = new Set([
  "Croissant lineup",
  "Korean chicken burger",
  "Nashville chicken burger",
  "Crispy chicken burger",
  "Chicken fillet burger",
  "Pitboss chickwich club",
  "Smoked chicken and corn beef pepper jack",
]);

function burgerAddOns(name: string, extra: Option[] = []): Option[] {
  const addOns = [fries, curlyFries];
  if (!noExtraPatty.has(name)) addOns.push(extraPatty);
  return [...addOns, ...extra];
}

export const burgers = category("Burgers and sandwiches", [
  menuItem("Midwest smoked pulled beef burger", 1240, {
    tags: ["smoked"],
    addOns: burgerAddOns("Midwest smoked pulled beef burger"),
  }),
  menuItem("Brisket burger (highway man style)", 1250, {
    addOns: burgerAddOns("Brisket burger (highway man style)"),
  }),
  menuItem("Beef ribs and mac burger", 1510, {
    addOns: burgerAddOns("Beef ribs and mac burger"),
  }),
  menuItem("The Beast", 1310, {
    description: "Brisket, double beef patties, jalapenos, special sauce",
    addOns: burgerAddOns("The Beast"),
  }),
  menuItem("Philly cheesesteak burger", 1410, {
    addOns: burgerAddOns("Philly cheesesteak burger"),
  }),
  menuItem("The holy chuck", 1100, {
    addOns: burgerAddOns("The holy chuck"),
  }),
  menuItem("Beef mushroom melt", 1050, {
    addOns: burgerAddOns("Beef mushroom melt"),
  }),
  menuItem("Classic Texas style smoked beef burger", 950, {
    tags: ["smoked"],
    addOns: burgerAddOns("Classic Texas style smoked beef burger"),
  }),
  menuItem("Pastrami on rye", 1610, {
    description: "Spicy mustard and cheese.",
    addOns: burgerAddOns("Pastrami on rye", [
      { id: "extra-meat", label: "Extra meat", price: 0 }, // TODO confirm price with owner
    ]),
  }),
  menuItem("Croissant lineup", 1310, {
    variants: variants("Croissant lineup", [
      ["Smoked pastrami", 1610],
      ["Smashed beef", 1350],
      ["Philly steak", 1550],
      ["Chicken", 1310],
    ]),
    addOns: burgerAddOns("Croissant lineup"),
  }),
  menuItem("Korean chicken burger", 810, {
    addOns: burgerAddOns("Korean chicken burger"),
  }),
  menuItem("Nashville chicken burger", 1040, {
    tags: ["spicy"],
    addOns: burgerAddOns("Nashville chicken burger"),
  }),
  menuItem("Crispy chicken burger", 910, {
    addOns: burgerAddOns("Crispy chicken burger"),
  }),
  menuItem("Chicken fillet burger", 910, {
    addOns: burgerAddOns("Chicken fillet burger"),
  }),
  menuItem("Pitboss chickwich club", 1210, {
    addOns: burgerAddOns("Pitboss chickwich club"),
  }),
  menuItem("Smoked chicken and corn beef pepper jack", 1110, {
    tags: ["smoked"],
    addOns: burgerAddOns("Smoked chicken and corn beef pepper jack"),
  }),
]);
