import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetShadowHostId,
  PlasmoGetStyle
} from "plasmo"
import { useEffect, useState, type FC } from "react"

import { useMessage } from "@plasmohq/messaging/hook"
import { useStorage } from "@plasmohq/storage/hook"

import TagBtnStyle from "~component/tagBtn/style"
import { addCss, i18n, removeCss, saveHtml, saveMarkdown } from "~tools"
import useCssCodeHook from "~utils/cssCodeHook"
import { useContent } from "~utils/editMarkdownHook"
import { Print } from "~utils/print"
import Turndown from "~utils/turndown"

export const config: PlasmoCSConfig = {
  matches: ["https://*.php.cn/*"]
}

const turndownService = Turndown()
const articleTitle = document
  .querySelector<HTMLElement>("head title")
  .innerText.trim()

const HOST_ID = "codebox-php"
export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector(".wzContent .wzctTitle")

export const getStyle: PlasmoGetStyle = () => TagBtnStyle()

const PlasmoOverlay: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [showTag, setShowTag] = useStorage<boolean>("php-showTag", true)
  const [cssCode, runCss] = useCssCodeHook("php")
  const [copyCode] = useStorage("php-copyCode", true)
  const [closeLoginModal] = useStorage<boolean>("php-closeLoginModal")
  const [history, setHistory] = useStorage<any[]>("codebox-history")
  const [closeLog] = useStorage("config-closeLog", true)
  const [content, setContent] = useContent()

  useEffect(() => {
    closeLog || console.log("PHP status", { closeLoginModal })
    copyCodeFunc(copyCode)
    closeLoginModal && closeLoginModalFunc()
  }, [closeLoginModal])

  useMessage(async (req, res) => {
    if (req.name == "php-isShow") {
      res.send({ isShow: true })
    }
    if (req.name == "php-editMarkdown") {
      editMarkdown()
    }
    if (req.name == "php-downloadMarkdown") {
      downloadMarkdown()
    }
    if (req.name == "php-downloadHtml") {
      downloadHtml()
    }
    if (req.name == "oschina-downloadPdf") {
      downloadPdf()
    }
  })

  function downloadPdf() {
    const article = document.querySelector<HTMLElement>(
      ".phpscMain .php-article"
    )
    if (article) {
      Print.print(article, { title: articleTitle })
        .then(() => console.log("Printing complete"))
        .catch((error) => console.error("Printing failed:", error))
    }
  }

  /* 未登录复制代码 */
  function copyCodeCssFunc(copyCode) {
    copyCode
      ? addCss(
          `
    .php-article .code,
    .php-article{
      -webkit-touch-callout: auto !important;
      -webkit-user-select: auto !important;
      -khtml-user-select: auto !important;
      -moz-user-select: auto !important;
      -ms-user-select: auto !important;
      user-select: auto !important;
    }`,
          `php-copyCode-css`
        )
      : removeCss(`php-copyCode-css`)
  }

  function copyCodeFunc(copyCode) {
    copyCode &&
      document.addEventListener("copy", function (event) {
        const selectedText = window.getSelection().toString()
        event.clipboardData.setData("text/plain", selectedText)
        event.preventDefault()
      })
    copyCodeCssFunc(copyCode)
  }

  // 关闭登录弹框
  function closeLoginModalFunc() {
    const css = `
    .layui-layer-shade,
    .layui-layer-iframe {
      display:none !important;
    }`
    addCss(css)
  }

  function editMarkdown() {
    const dom = document.querySelector(".phpscMain .php-article")
    setContent(dom)
  }

  function downloadMarkdown() {
    const html = document.querySelector(".phpscMain .php-article")
    const markdown = turndownService.turndown(html)
    saveMarkdown(markdown, articleTitle)
  }

  function downloadHtml() {
    const dom = document.querySelector(".phpscMain .php-article")
    saveHtml(dom, articleTitle)
  }

  function handleEdit() {
    editMarkdown()
  }

  function handleDownload() {
    downloadMarkdown()
  }

  function handlePrint() {
    downloadPdf()
  }

  function closeTag() {
    setShowTag(false)
  }

  return showTag ? (
    <div className="codebox-tagBtn">
      <div onClick={handleEdit}>{i18n("edit")}</div>
      <div onClick={handleDownload}>{i18n("download")}</div>
      <div onClick={handlePrint}>{i18n("print")}</div>
    </div>
  ) : (
    <></>
  )
}

export default PlasmoOverlay
