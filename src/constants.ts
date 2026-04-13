import type { Props } from "astro";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconZhihu from "@/assets/icons/IconZhihu.svg";
import IconJike from "@/assets/icons/IconJike.svg";
import IconRss from "@/assets/icons/IconRss.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconMail from "@/assets/icons/IconMail.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/kevin7lou",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/kevin7lou",
    linkTitle: `${SITE.title} on Twitter`,
    icon: IconBrandX,
  },
  {
    name: "知乎",
    href: "https://www.zhihu.com/people/kevin7lou",
    linkTitle: `${SITE.title} on 知乎`,
    icon: IconZhihu,
  },
  {
    name: "即刻",
    href: "https://okjk.co/sCWqF2",
    linkTitle: `${SITE.title} on 即刻`,
    icon: IconJike,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `${SITE.title} RSS Feed`,
    icon: IconRss,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
    icon: IconMail,
  },
] as const;
