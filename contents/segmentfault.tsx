import type {
  PlasmoCSConfig,
  PlasmoCSUIProps,
  PlasmoGetOverlayAnchor,
  PlasmoGetShadowHostId,
  PlasmoGetStyle
} from "plasmo"
import type { FC } from "react"

import { useMessage } from "@plasmohq/messaging/hook"
import { useStorage } from "@plasmohq/storage/dist/hook"

import TagBtnStyle from "~component/tagBtn/style"
import { i18n, saveHtml, saveMarkdown } from "~tools"
import useCssCodeHook from "~utils/cssCodeHook"
import { useContent } from "~utils/editMarkdownHook"
import { Print } from "~utils/print"
import Turndown from "~utils/turndown"

export const config: PlasmoCSConfig = {
  matches: ["https://*.segmentfault.com/**"]
}

const turndownService = Turndown()
const articleTitle = document
  .querySelector<HTMLElement>("head title")
  .innerText.trim()

const HOST_ID = "codebox-segmentfault"
export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector(".container .h2")

export const getStyle: PlasmoGetStyle = () => TagBtnStyle()

const PlasmoOverlay: FC<PlasmoCSUIProps> = ({ anchor }) => {
  const [showTag, setShowTag] = useStorage<boolean>(
    "segmentfault-showTag",
    true
  )
  const [cssCode, runCss] = useCssCodeHook("segmentfault")
  const [content, setContent] = useContent()

  useMessage(async (req, res) => {
    if (req.name == "segmentfault-isShow") {
      res.send({ isShow: true })
    }
    if (req.name == "segmentfault-editMarkdown") {
      editMarkdown()
    }
    if (req.name == "segmentfault-downloadMarkdown") {
      downloadMarkdown()
    }
    if (req.name == "segmentfault-downloadHtml") {
      downloadHtml()
    }
    if (req.name == "segmentfault-downloadPdf") {
      downloadPdf()
    }
  })

  function downloadPdf() {
    const article = document.querySelector<HTMLElement>(".container")
    if (article) {
      Print.print(article, { title: articleTitle })
        .then(() => console.log("Printing complete"))
        .catch((error) => console.error("Printing failed:", error))
    }
  }

  function editMarkdown() {
    const dom = document.querySelector(".container")
    setContent(dom)
  }

  function downloadMarkdown() {
    const html = document.querySelector(".container")
    const markdown = turndownService.turndown(html)
    saveMarkdown(markdown, articleTitle)
  }

  function downloadHtml() {
    const dom = document.querySelector(".container")
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
