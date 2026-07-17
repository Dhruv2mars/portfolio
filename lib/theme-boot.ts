import { THEME_STORAGE_KEY } from "@/lib/theme";

/** Inline boot script — keeps first paint aligned with stored / system preference. */
export function themeBootScript(): string {
  return `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var p=localStorage.getItem(k);if(p!=="light"&&p!=="dark"&&p!=="system")p="system";var s=null;if(window.matchMedia("(prefers-color-scheme: light)").matches)s="light";else if(window.matchMedia("(prefers-color-scheme: dark)").matches)s="dark";var r=p==="light"||p==="dark"?p:(s||"dark");var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(r);d.style.colorScheme=r;}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}})();`;
}
