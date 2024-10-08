import { DownloadOutlined, EditOutlined, StarTwoTone } from "@ant-design/icons"

import { sendToContentScript } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import EditMarkdown from "~component/items/editMarkdown"
import { i18n } from "~tools"

export default function Cto51() {
  const [copyCode, setCopyCode] = useStorage("51cto-copyCode", (v) =>
    v === undefined ? true : v
  )
  const [closeLoginModal, setCloseLoginModal] = useStorage(
    "51cto-closeLoginModal",
    (v) => (v === undefined ? true : v)
  )

  function downloadMarkdown() {
    sendToContentScript({
      name: "51cto-downloadMarkdown"
    })
  }

  function downloadHtml() {
    sendToContentScript({
      name: "51cto-downloadHtml"
    })
  }

  return (
    <fieldset>
      <legend>{i18n("51ctoConfig")}</legend>
      <div className="item">
        <span>{i18n("51ctoCopyCode")}</span>
        <input
          type="checkbox"
          id="51cto-copyCode"
          name="51cto-copyCode"
          className="codebox-offscreen"
          checked={copyCode}
          onChange={(e) => setCopyCode(e.target.checked)}
        />
        <label className="codebox-switch" htmlFor="51cto-copyCode"></label>
      </div>
      <div className="item">
        <span>{i18n("51ctoCloseLoginModal")}</span>
        <input
          type="checkbox"
          id="51cto-closeLoginModal"
          name="51cto-closeLoginModal"
          className="codebox-offscreen"
          checked={closeLoginModal}
          onChange={(e) => setCloseLoginModal(e.target.checked)}
        />
        <label
          htmlFor="51cto-closeLoginModal"
          className="codebox-switch"></label>
      </div>
      <EditMarkdown></EditMarkdown>
      <div className="item download" onClick={downloadMarkdown}>
        <span>
          <StarTwoTone twoToneColor="#eb2f96" style={{ marginRight: "5px" }} />
          {i18n("downloadMarkdown")}
        </span>
        <DownloadOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
      </div>
      <div className="item download" onClick={downloadHtml}>
        <span>
          <StarTwoTone twoToneColor="#eb2f96" style={{ marginRight: "5px" }} />
          {i18n("downloadHtml")}
        </span>
        <DownloadOutlined style={{ color: "#52c41a", fontSize: "16px" }} />
      </div>
    </fieldset>
  )
}
