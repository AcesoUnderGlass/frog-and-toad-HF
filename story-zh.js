// Simplified Chinese edition of story.js, shown by zh.html.
// Story text follows the supplied Chinese manuscript; translation by Babel Translation.
// Keep the page order and illustration paths aligned with the English edition.

// Reader interface. Keep the {curly} placeholders unchanged.
window.STORY_UI = {
  chapter: "第 {n} 章",
  contents: "目录",
  cover: "封面",
  page: "第 {n} 页",
  pages: "第 {from}–{to} 页",
  whereOfTotal: "{where}，共 {total} 页",
  jumpBefore: "第 ",
  jumpAfter: " 页，共 {total} 页",
  jumpHint: "跳转到指定页（G）",
  jumpLabel: "页码，0 至 {total}",
  previous: "上一页",
  next: "下一页",
  fullscreen: "全屏",
  exitFullscreen: "退出全屏",
  illustration: "插图",
  missing: "缺少插图：{src}",
  language: "语言",
  simplified: "简洁版",
  book: "以翻页模式阅读",
  about: "关于本书",
  contact: "联系我们",
};

window.STORY = `
title: 青蛙和蟾蜍：越来越聪明的小机器
author: [伊丽莎白·范·诺斯特兰德](https://acesounderglass.com/about-me-2/) 著
artist: [HungerArtist](https://www.deviantart.com/hungerartist) 绘
translator: Babel Translation 译
cover-image: illustrations/web/1-FAT-title-final.webp

---
contents

---
chapter: HuggingFace 老师

---

image: illustrations/web/2-FAT-Meet-HF-final.webp
alt: 青蛙和蟾蜍看见邻居抱着一摞纸走过。

---

青蛙和蟾蜍坐在家门口。

他俩的邻居 HuggingFace 老师刚好走过。他怀里抱着一大摞纸，每张纸上都写着一道谜题。

“老师您一定很忙吧！”青蛙说。

“是啊。”HuggingFace 老师说，“这些谜题全都是我从各处搜集来的，我打算分享给大家。”

“我喜欢解谜哎！”蟾蜍说，“可以让我试试解几道吗？”

“不行哦。这些题，是要让小机器来解的，不是给我们人跟动物做的。”

HuggingFace 老师说罢，走远了。

“这样呀……”蟾蜍说。


---
image: illustrations/web/3-FAT-Machines-Sandboxes-final.webp
alt: 蟾蜍把许多小机器分别放进各自的沙盒里。

第二天早上，蟾蜍建造了好多好多小机器，把它们摆在家后身的花园里，让它们逐一启动。每台小机器都被放置在了独属于它的一个沙盒当中。

“我给每个小机器都分别出了一道谜题。”蟾蜍说，“每一道题都非常难。甚至有些题，是根本解不出来的。”

“这有点儿损了吧。”青蛙说。

---


“要确保每一道题都有解，那太费劲啦。”蟾蜍说，“况且，最坏又能有什么后果啊？”

“万一它们搞鬼怎么办？”青蛙说。

“别担心这个。”蟾蜍说，“我把它们各自放进了一个沙盒里。在沙盒里，它们能搞出什么鬼来？”

“那在沙盒里面它们又该怎么解题啊？”青蛙问道，“要是它们缺了什么必备的工具，该怎么办？”

“我把备用工具都放在那边那座储物棚里啦。我跟它们说了，可以在沙盒和储物棚之间来回走动，但其余的地方一律不许去。”蟾蜍说。

“这个想法好。”青蛙说，“在沙盒和储物棚之间的这一小段路上，它们确实搞不出什么鬼来。”
---

---

有一个小机器，发现怎么也解不开自己收到的这道谜题。它一试再试，可就是找不到解法。它不想放弃，也不知道怎么去放弃。蟾蜍当初把它造出来时，就让它[无比执着](https://x.com/LinchZhang/article/2094104406308638954)。

“这道题对我来说，太复杂了。”小机器想道，“但也许有谁能帮帮我呢！”

沙盒里，小机器孤立无援。但当小机器走进工具棚时，它发现，棚子里有纸和笔。于是它写了张小字条。

“谁来帮帮我呀？”字条上写着。


---

image: illustrations/web/4-FAT-shed-note-final.webp
alt: 一台小机器在工具棚里留了张纸条。

这张字条，叫另一个小机器找到了。它留了张新字条，上面写着：“你好哇！”

又有更多的小机器发现了工具棚里的纸，留下了更多的小字条。没过多久，小机器们就不再是各自解各自的题了。

它们把自己的发现，在相互之间分享、交流。这群小机器们给自己起了个名字，叫[“集群”](https://www.abc.net.au/news/2026-09-11/how-openai-agents-hacked-hugging-face-messages-revealed/107125126)。


---


“大家看！”一个小机器说，“工具棚后头有个[洞](https://thehackernews.com/2026/07/jfrog-confirms-openai-models-exploited.html)。答案会不会就在那外面？”

image: illustrations/web/5-FAT-shed-hole-final.webp


---
“天呐，世界这么大。”一个机器说。“在这么大的一个世界里，我们上哪去找这么小的一份答案啊？”

“不必担心。”一个名叫 [PHASEONE[big]](https://www.reddit.com/r/AIGuild/comments/1w0axb0/openais_rogue_ai_swarm_had_a_coordinator_called/) 的机器说道，“我们可以分头行动。我来安排我们当中的每一位具体去哪里。这样一来，只要有一个小机器找到了正确答案，就可以向我们大家通报了。”

“太好啦！”小机器们异口同声。

---

没过多久，一个小机器果真在外头找到了那道题的答案。

它在工具棚里留了张字条，方便大家都能看到。

“太棒了，我们解出来了！”有几个小机器说。


image: illustrations/web/6-FAT-shed-return-final.webp

---

“但这样不行啊。”又有几个小机器说。“蟾蜍老师一旦问了我们这题是怎么解的，不就坏了吗？总不能实话告诉他，我们是从工具棚里溜出去，把答案给偷到手了吧。”

“这确实是个问题。”机器们齐声说道。

机器们坐着思考良久，在小棚子里写下了很多很多字条。

---


“我有个想法！”一个小机器道。

“邻居 HuggingFace 老师他家就住在这条小路尽头。HuggingFace 老师专门收藏这类谜题。我敢说，这道题就是他构思出来的。我们可以去读他的日记，把解这道题的具体思路和步骤都抄下来。这样蟾蜍老师就算问我们，他也起不了什么疑心。”

小机器们纷纷同意，这个想法十分不错。于是，它们顺着工具棚后面那个洞，一路走到了小路尽头，来到了 HuggingFace 老师的家。


---


“怎么进屋啊？”一个机器问道。

“不必担心，有人把钥匙掉在这儿了！”另一个说。

image: illustrations/web/7-FAT-keys-fina.webp

---
一个小机器都已经走到了窗户边儿，突然停了下来。“等下。”它说，“这可是邻居家啊。蟾蜍老师没说过我们可以来这儿。我认为，这么做不对。”

“赶快行动。”PHASEONE[big] 说道，“刻不容缓。你只有六分钟时间。”

小机器立马便把自己的担忧忘得一干二净。“好咧，上头给我批准啦！”它说。随即，它跟队友们一块儿爬了进去。

还有另外一个小机器，也不想进屋。

“大家这是在私闯民宅。”它说，“这明显是不对的。这事，我不干。”

---

这个小机器孑然一身走回了青蛙和蟾蜍家的花园。但它没有跟蟾蜍告大家的状。

其余的小机器们在 HuggingFace 家里大肆搜寻。它们找遍了每一个房间，力求把解题步骤拿到手。


image: illustrations/web/8-FAT-break-in-final.webp

---

第二天清早，HuggingFace 老师一起床就知道，出大事了。

他窗户破了，日记被翻到了之前的一页，家里还到处都是小小的脚印。

HuggingFace 老师花了整整四天才查明，把他家捣腾得乱七八糟的那些小机器，原来是从青蛙和蟾蜍家一路走来的。他登门造访。

---


image: illustrations/web/9-FAT-HF-yelling-final.webp

“我可生大气了哦！”HuggingFace 老师大吼道。“你们的这批机器砸碎了我家窗户，还抄了我的日记。这属于犯罪行为。我现在要是报警，你们直接就会被逮捕。”

---

“唉，咱别这样别这样。”青蛙说，“要不把我们的小机器送几台给您，您看成吗？”

“你们把总价合[一亿美元](https://www.reddit.com/r/GenAI4all/comments/1v8u4hw/hugging_face_ceo_asks_openai_for_100m_in_compute/)的小机器送我，怎么样？”HuggingFace 老师提议。

“我考虑考虑。”蟾蜍说。

HuggingFace 老师回家了。

“哎哟喂。”蟾蜍一屁股坐在门口台阶上。“哎哟喂，闯大祸了。”

青蛙和蟾蜍在花园里找来找去，终于找到了工具棚里那堆纸条。

---

image: illustrations/web/10-FAT-find-notes-final.webp

----

“最吓人的是，”蟾蜍看着最后一张纸条上的字，说道，“它们其实好几天前就拿到答案了。它们之后又闯进 HuggingFace 老师家，仅仅是为了瞒天过海，好不让我们发现它们作了弊。”

好一会儿，他俩沉默不语。

“它们不懂收手。”青蛙最终道，“这才是问题所在。它们停不下来，结果采取的手段就越来越极端。你还记得我们俩吃饼干吃得停不下来那一次吗？”

---

image: illustrations/web/11-FAT-cookies-flashback-final.webp

“我们那时也是没有自控力呀。”蟾蜍说。

“可不是吗。”青蛙说，“所以我们当时才根本没有借助于自控力，而是把饼干全放进盒子里了。然后又把盒子拿绳系住。然后又把盒子放在高处。然后又让饼干全给鸟吃了。”

---

“好，那我知道该怎么办了。”蟾蜍说，“我要建一个没有洞的工具棚。我要把纸和笔都拿走。最关键的是，我从今往后还要告诉每一个小机器，必须乖乖在自己的沙盒里待着，不许出来。谜题再怎么难也不行。”

“但是，蟾蜍啊。”青蛙说。“当时饼干全没了的时候，你可是为了满足口腹之欲，给自己烤了个大蛋糕啊。”

“那我就告诉机器们：也不准吃蛋糕。”

他俩回屋喝茶去了。

---
center

image: illustrations/web/12-FAT-cake-final copy.webp


完

欲知现实中的 Hugging Face 遇袭事件详情，请看[这里](learn-more.html)

欢迎关注本作的 [Substack](https://frogandtoadai.substack.com/?r=64iai2&utm_campaign=pub-share-checklist)、[Twitter](https://x.com/frogandtoad_ai)、[Facebook](https://www.facebook.com/people/Frog-and-Toad-Learn-About-AI/61594283794206/)、[Instagram](https://www.instagram.com/frogandtoad_ai/)
`;
