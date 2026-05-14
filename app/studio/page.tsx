"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Script from "next/script"

import Footer from "../Footer";
import Menu from "../Menu";

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
interface BagModel {
  id: string
  name: string
  dims: string
  icon: string
  imgUrl: string | null
}

interface BagColor {
  hex: string
  label: string
  grad: [string, string]
}

/* ═══════════════════════════════════════════════
   STATIC CONFIG
═══════════════════════════════════════════════ */
const BAG_MODELS: BagModel[] = [
  { id: "tote",      name: "Maxi Tote",   dims: "40 × 35 cm", icon: "👜", imgUrl: "/images/bolsa_maxi_tote.png" },
  { id: "shoulder",  name: "Maxi Puffer",  dims: "30 × 30 cm", icon: "👛", imgUrl: "/images/maxi_puffer.png" },
  { id: "crossbody", name: "Notebook",   dims: "48 × 36 cm", icon: "💼", imgUrl: "/images/bolsanotebook.png" },
  { id: "mini",      name: "Necessaire",      dims: "25 × 20 cm", icon: "👝", imgUrl:"/images/necessaire_efe.png" },
]

let msgError = "N";

const BAG_COLORS: BagColor[] = [
  { hex: "#39161b", label: "Marrom",  grad: ["#39161b", "#39161b"] },
  { hex: "#5d4934", label: "Marrom Terra",  grad: ["#5d4934", "#5d4934"] }, 
  { hex: "#39083a", label: "Bergamota",  grad: ["#39083a", "#39083a"] },
  { hex: "#b30037", label: "Vermelho Cherry",    grad: ["#b30037", "#b30037"] },
  { hex: "#7d161d", label: "Vermelho Vinho",    grad: ["#7d161d", "#7d161d"] },
  { hex: "#cfc2dd", label: "Lilás",       grad: ["#cfc2dd", "#cfc2dd"] },
  { hex: "#f5dd6a", label: "Amarelo Gema",     grad: ["#f5dd6a", "#f5dd6a"] },
  { hex: "#f1e731", label: "Amarelo Limão",  grad: ["#f1e731", "#f1e731"] },
  { hex: "#ba9221", label: "Mostarda",  grad: ["#ba9221", "#ba9221"] }, 
  { hex: "#80e14f", label: "Verde Flúor",  grad: ["#80e14f", "#80e14f"] },
  { hex: "#3b4625", label: "Verde Oliva", grad: ["#3b4625", "#3b4625"] },
  { hex: "#27744b", label: "Verde Bandeira", grad: ["#27744b", "#27744b"] },
  { hex: "#fa656f", label: "Rosa Chiclete",     grad: ["#fa656f", "#fa656f"] },
  { hex: "#e6bfbf", label: "Rosa Pêssego",     grad: ["#e6bfbf", "#e6bfbf"] },
  { hex: "#d3806c", label: "Rosa Goiaba",     grad: ["#d3806c", "#d3806c"] },
  { hex: "#ddb1cb", label: "Rosa bebê",         grad: ["#ddb1cb", "#ddb1cb"] },
  { hex: "#d4c0b6", label: "Areia",     grad: ["#d4c0b6", "#d4c0b6"] },
  { hex: "#F5F5F5", label: "Branco",   grad: ["#FFFFFF", "#E5E5E5"] },
  { hex: "#efede1", label: "Off White",   grad: ["#efede1", "#efede1"] },
  { hex: "#e6e6ec", label: "Ice",   grad: ["#e6e6ec", "#e6e6ec"] },
  { hex: "#b1c7bf", label: "Lácteo",   grad: ["#b1c7bf", "#b1c7bf"] },
  { hex: "#11132a", label: "Azul Marinho",       grad: ["#0d1025", "#11132a"] },
  { hex: "#23324d", label: "Azul Índigo",  grad: ["#23324d", "#23324d"] },
  { hex: "#58b1d0", label: "Azul Turqueza",  grad: ["#58b1d0", "#58b1d0"] },
  { hex: "#b0d7f1", label: "Azul Bebê",  grad: ["#b0d7f1", "#b0d7f1"] },
  { hex: "#181717", label: "Preto",       grad: ["#040505", "#040505"] },
  { hex: "#abada6", label: "Silver",       grad: ["#abada6", "#abada6"] },
  { hex: "#706e6b", label: "Dusty Grey",       grad: ["#706e6b", "#706e6b"] },
]

/* ═══════════════════════════════════════════════
   COLOR UTILS
═══════════════════════════════════════════════ */
function hexToRGB(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")
}
function lighten(hex: string, amt: number): string {
  const [r, g, b] = hexToRGB(hex)
  return rgbToHex(Math.min(255, r + amt), Math.min(255, g + amt), Math.min(255, b + amt))
}
function darken(hex: string, amt: number): string {
  const [r, g, b] = hexToRGB(hex)
  return rgbToHex(Math.max(0, r - amt), Math.max(0, g - amt), Math.max(0, b - amt))
}

/* ═══════════════════════════════════════════════
   CANVAS DRAWING HELPERS
═══════════════════════════════════════════════ */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawArc(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number, start: number, end: number
) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, start, end)
  ctx.stroke()
}

function drawHandles(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  modelId: string,
  color: BagColor
) {
  const col = darken(color.hex, 18)
  ctx.strokeStyle = col
  ctx.lineCap = "round"
  ctx.shadowColor = "rgba(0,0,0,.35)"
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 5

  if (modelId === "tote") {
    ctx.lineWidth = 20
    drawArc(ctx, W * 0.3, 40, 32, Math.PI, 0)
    drawArc(ctx, W * 0.7, 40, 32, Math.PI, 0)
  } else if (modelId === "shoulder") {
    ctx.lineWidth = 18
    drawArc(ctx, W * 0.5, 38, 42, Math.PI, 0)
  } else if (modelId === "crossbody") {
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.moveTo(W * 0.18, 32)
    ctx.lineTo(W * 0.82, 32)
    ctx.stroke()
  } else if (modelId === "mini") {
    ctx.lineWidth = 14
    drawArc(ctx, W * 0.5, 34, 26, Math.PI, 0)
  }
  ctx.shadowColor = "transparent"
}

function overlayEmbroidery(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  scale: number,
  offX: number, offY: number,
  lineW: number,
  color: BagColor,
  edgeData: ImageData
) {
  const { width: ew, height: eh, data } = edgeData
  const targetW = W * scale
  const targetH = (eh / ew) * targetW
  const dx = (W - targetW) / 2 + (offX / 100) * W
  const dy = (W - targetH) / 2 + (offY / 100) * H
  const scX = targetW / ew
  const scY = targetH / eh
  const lw = lineW || 1.5

  const path = new Path2D()
  for (let row = 1; row < eh - 1; row++) {
    let inStroke = false
    let startX = 0
    const rowY = dy + row * scY
    for (let col = 1; col < ew; col++) {
      const isEdge = data[(row * ew + col) * 4] < 128
      if (isEdge && !inStroke) { inStroke = true; startX = col }
      else if (!isEdge && inStroke) {
        inStroke = false
        path.moveTo(dx + startX * scX, rowY)
        path.lineTo(dx + col * scX, rowY)
      }
    }
  }

  ctx.save()
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  // Sulco (sombra profunda)
  ctx.shadowColor = darken(color.hex, 70)
  ctx.shadowBlur = lw * 6
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  ctx.strokeStyle = darken(color.hex, 60)
  ctx.lineWidth = lw
  ctx.stroke(path)

  // Brilho puffer
  ctx.shadowColor = "transparent"
  ctx.globalCompositeOperation = "overlay"
  ctx.filter = "blur(16px)"
  ctx.strokeStyle = "rgba(250,250,250,0.1)"
  ctx.lineWidth = lw * 28
  ctx.stroke(path)

  ctx.restore()
}

function drawBagShape(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  modelId: string,
  color: BagColor,
  edgeData: ImageData | null,
  scale: number,
  offX: number, offY: number,
  opacity: number,
  lineW: number
) {
  ctx.save()
  ctx.globalAlpha = opacity

  const PAD = 45
  const CELL = 36
  const bx = PAD, by = 60, bw = W - PAD * 2, bh = H - PAD - 60

  roundRectPath(ctx, bx, by, bw, bh, 22)
  ctx.save()
  ctx.clip()

  for (let y = by; y < by + bh; y += CELL) {
    for (let x = bx; x < bx + bw; x += CELL) {
      const cw = Math.min(CELL, bx + bw - x)
      const ch = Math.min(CELL, by + bh - y)
      const g = ctx.createRadialGradient(
        x + cw / 2, y + ch / 2, 0,
        x + cw / 2, y + ch / 2, Math.max(cw, ch) * 0.65
      )
      g.addColorStop(0, lighten(color.hex, 28))
      g.addColorStop(0.5, color.hex)
      g.addColorStop(1, darken(color.hex, 38))
      ctx.fillStyle = g
      roundRectPath(ctx, x, y, cw, ch, 7)
      ctx.fill()
      ctx.strokeStyle = darken(color.hex, 15)
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }

  if (edgeData) {
    overlayEmbroidery(ctx, W, H, scale, offX, offY, lineW, color, edgeData)
  }

  ctx.restore()

  roundRectPath(ctx, bx, by, bw, bh, 22)
  ctx.strokeStyle = darken(color.hex, 40)
  ctx.lineWidth = 3
  ctx.stroke()

  drawHandles(ctx, W, H, modelId, color)
  ctx.restore()
}

function drawMiniThumb(
  el: HTMLElement,
  model: BagModel,
  color: BagColor
) {
  el.innerHTML = ""
  const c = document.createElement("canvas")
  c.width = 120; c.height = 120
  c.style.width = "100%"; c.style.height = "100%"
  el.appendChild(c)
  const ctx = c.getContext("2d")!
  drawBagShape(ctx, 120, 120, model.id, color, null, 0, 0, 0.95, 2,1)
}




/* ─────────────────────────────────────────────
   drawColoredBagImage
   O PNG original tem fundo BEGE sólido (alpha=255
   em tudo). Precisamos separar bolsa do fundo
   pelo brilho:
     • Pixels escuros (brilho < 150) = bolsa
       → pintar com a cor escolhida
     • Pixels de transição (150-190) = borda suave
       → pintar com a cor + alpha proporcional
     • Pixels claros (brilho >= 190) = fundo
       → deixar bege
───────────────────────────────────────────── */
function drawColoredBagImage(
  ctx: CanvasRenderingContext2D,
  bagImg: HTMLImageElement,
  W: number,
  H: number,
  color: BagColor
) {
  // Canvas auxiliar para ler pixels do PNG original
  const tmp = document.createElement("canvas")
  tmp.width = W; tmp.height = H
  const tctx = tmp.getContext("2d")!
  tctx.drawImage(bagImg, 0, 0, W, H)

  const src = tctx.getImageData(0, 0, W, H)
  const s = src.data

  // Canvas de saída — começa totalmente transparente
  const out = document.createElement("canvas")
  out.width = W; out.height = H
  const octx = out.getContext("2d")!
  const outData = octx.createImageData(W, H)
  const d = outData.data

  const [tr, tg, tb] = hexToRGB(color.hex)
  const THRESH = 150
  const FADE   = 190

  for (let i = 0; i < s.length; i += 4) {
    const brightness = (s[i] + s[i+1] + s[i+2]) / 3

    if (brightness < THRESH) {
      // Pixel da bolsa → cor escolhida, totalmente opaco
      d[i]   = tr
      d[i+1] = tg
      d[i+2] = tb
      d[i+3] = 255
    } 
	
	else if (brightness < FADE) {
      // Borda suave → cor escolhida com alpha proporcional
      const alpha = Math.round((FADE - brightness) / (FADE - THRESH) * 255)
      d[i]   = tr
      d[i+1] = tg
      d[i+2] = tb
      d[i+3] = alpha
    }
     //else: fundo claro → permanece [234,226,214,1] bege ( [0,0,0,0] transparente)
	 
	 else if (brightness >= FADE) {
      //[234,226,214,1] bege 
      d[i]   = 234
      d[i+1] = 226
      d[i+2] = 214
      d[i+3] = 1
    }
  }

  octx.putImageData(outData, 0, 0)

  // Desenha o resultado colorido no canvas principal
  ctx.drawImage(out, 0, 0)
}

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function StudioPuffer() {
  /* ── State ── */
  const [cvReady, setCvReady] = useState(false)
  const [statusType, setStatusType] = useState<"loading" | "ready" | "busy" | "error">("loading")
  const [statusMsg, setStatusMsg]   = useState("Carregando, aguarde…")
  const [selectedModel, setSelectedModel] = useState<BagModel>(BAG_MODELS[0])
  const [selectedColor, setSelectedColor] = useState<BagColor>(BAG_COLORS[0])
  const [thumbSrc, setThumbSrc]     = useState<string | null>(null)
  const [showCtrl, setShowCtrl]     = useState(false)
  const [dlEnabled, setDlEnabled]   = useState(false)
  const [loading, setLoading]       = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("Processando…")
  const [showHint, setShowHint]     = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)

  // ── IA Enhance ──
  const [aiEnabled, setAiEnabled]     = useState(false)
  const [aiLoading, setAiLoading]     = useState(false)
  const [aiResult, setAiResult]       = useState<string | null>(null)
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiError, setAiError]         = useState<string | null>(null)
  const lastBlobRef = useRef<Blob | null>(null)
  
  /* Controls */
  const [t1, setT1]         = useState(80)
  const [t2, setT2]         = useState(160)
  const [lineW, setLineW]   = useState(2)
  const [scale, setScale]   = useState(60)
  const [posX, setPosX]     = useState(0)
  const [posY, setPosY]     = useState(17)

  /* ── Refs ── */
  const inputCanvasRef = useRef<HTMLCanvasElement>(null)
  const edgeCanvasRef  = useRef<HTMLCanvasElement>(null)
  const bagCanvasRef   = useRef<HTMLCanvasElement>(null)
  const originalImgRef = useRef<HTMLImageElement | null>(null)
  const edgeDataRef    = useRef<ImageData | null>(null)
  const sidebarRef     = useRef<HTMLDivElement>(null)
  const fileInputRef   = useRef<HTMLInputElement>(null)

  /* ── Status helper ── */
  const setStatus = useCallback((type: typeof statusType, msg: string) => {
    setStatusType(type)
    setStatusMsg(msg)
  }, [])

  /* ── Wait for OpenCV ── */
  useEffect(() => {
    let cancelled = false
    function wait() {
      if (cancelled) return
      const w = window as any
      if (typeof w.cv !== "undefined") {
        if (w.cv.Mat) {
          setCvReady(true)
          setStatus("ready", "Pronto — faça o upload da sua imagem")
        } else {
          w.cv["onRuntimeInitialized"] = () => {
            if (!cancelled) {
              setCvReady(true)
              setStatus("ready", "Pronto — faça o upload da sua imagem")
            }
          }
        }
      } else {
        setTimeout(wait, 300)
      }
    }
    wait()
    return () => { cancelled = true }
  }, [setStatus])
  
   /* ── api cloudinary error console ── */
  useEffect(() => {
  if (msgError === "N") {
    console.log(aiError);
	msgError= "";
  }
}, [msgError, aiError]);

  /* ── Scroll hint ── */
  useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return
    const check = () => {
      if (!hintDismissed && sidebar.scrollHeight > sidebar.clientHeight + 10) {
        setShowHint(true)
      } else {
        setShowHint(false)
      }
    }
    const timer = setTimeout(check, 300)
    const observer = new MutationObserver(check)
    observer.observe(sidebar, { childList: true, subtree: true, attributes: true })
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [showCtrl, hintDismissed])

  const handleSidebarScroll = useCallback(() => {
    if (!hintDismissed) {
      setHintDismissed(true)
      setShowHint(false)
    }
  }, [hintDismissed])

  /* ── Build mini thumbs when color/model changes ── */
  useEffect(() => {
    BAG_MODELS.forEach((m) => {
      if (!m.imgUrl) {
        const el = document.getElementById(`mtp-${m.id}`)
        if (el) drawMiniThumb(el, m, selectedColor)
      }
    })
  }, [selectedColor])

  /* ── Re-render bag when controls change ── */
  useEffect(() => {
    if (edgeDataRef.current) renderBag()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel, selectedColor, scale, posX, posY, lineW])

  /* ── Process edges when thresholds change ── */
  useEffect(() => {
    if (originalImgRef.current && cvReady) processEdges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t1, t2])

  /* ── File upload ── */
  function loadFile(file: File) {
    if (!cvReady) { alert("Puffer Studio ainda está carregando. Aguarde."); return }
    if (file.size > 10 * 1024 * 1024) { alert("Arquivo muito grande (máx 10 MB)"); return }

    setLoading(true); setLoadingMsg("Lendo imagem…")

    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        originalImgRef.current = img
        setThumbSrc(ev.target?.result as string)
        setShowCtrl(true)
        processEdges()
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  /* ── OpenCV edge detection ── */
  function processEdges() {
    const cv = (window as any).cv
    if (!cv || !originalImgRef.current) return
    setLoading(true); setLoadingMsg("Detectando bordado…")
    setStatus("busy", "Processando…")

    setTimeout(() => {
      try {
        const ic = inputCanvasRef.current!
        const ec = edgeCanvasRef.current!
        const img = originalImgRef.current!
        const MAX = 600
        let w = img.width, h = img.height
        if (w > MAX || h > MAX) {
          const r = Math.min(MAX / w, MAX / h)
          w = Math.round(w * r); h = Math.round(h * r)
        }
        ic.width = w; ic.height = h
        ic.getContext("2d")!.drawImage(img, 0, 0, w, h)

        const src     = cv.imread(ic)
        const gray    = new cv.Mat()
        const edges   = new cv.Mat()
        const blurred = new cv.Mat()

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
        cv.GaussianBlur(gray, blurred, new cv.Size(3, 3), 0)
        cv.Canny(blurred, edges, t1, t2)
        cv.bitwise_not(edges, edges)

        ec.width = w; ec.height = h
        cv.imshow(ec, edges)
        edgeDataRef.current = ec.getContext("2d")!.getImageData(0, 0, w, h)

        src.delete(); gray.delete(); edges.delete(); blurred.delete()

        setLoading(false)
        setStatus("ready", "Bordado processado ✓")
        renderBag()
      } catch (e: any) {
        setLoading(false)
        setStatus("error", "Erro: " + e.message)
      }
    }, 30)
  }

  /* ── Render bag ── */
  function renderBag() {
    const bagCanvas = bagCanvasRef.current
    if (!bagCanvas) return

    const sizes: Record<string, { w: number; h: number }> = {
      tote:      { w: 760, h: 800 },
      shoulder:  { w: 710, h: 760 },
      crossbody: { w: 710, h: 760 },
      mini:      { w: 400, h: 460 },
    }
    const sz = sizes[selectedModel.id] || sizes.tote
    bagCanvas.width  = sz.w
    bagCanvas.height = sz.h
    const ctx = bagCanvas.getContext("2d")!
    ctx.clearRect(0, 0, sz.w, sz.h)

    const sc = scale / 100

    function finalize() {
      bagCanvas!.style.display = "block"
      setDlEnabled(true)
      const ph = document.getElementById("previewPlaceholder")
      if (ph) ph.style.display = "none"
    }

    if (selectedModel.imgUrl) {
      const bagImg = new Image()
      bagImg.crossOrigin = "anonymous"
      bagImg.onload = () => {
        ctx.drawImage(bagImg, 0, 0, sz.w, sz.h)
        if (edgeDataRef.current) {
          overlayEmbroidery(ctx, sz.w, sz.h, sc, posX, posY, lineW, selectedColor, edgeDataRef.current)
        }
        finalize()
      }
      bagImg.onerror = () => {
        drawBagShape(ctx, sz.w, sz.h, selectedModel.id, selectedColor,
          edgeDataRef.current, sc, posX, posY, 1, lineW)
        finalize()
      }
      bagImg.src = selectedModel.imgUrl
    } else {
      drawBagShape(ctx, sz.w, sz.h, selectedModel.id, selectedColor,
        edgeDataRef.current, sc, posX, posY, 1, lineW)
      finalize()
    }
  }

    /* ── Download ── */
  function handleDownload() {
    if (!selectedModel.imgUrl) {
      // Modelos sem foto: baixa direto do canvas de preview
      const src = bagCanvasRef.current
      if (!src) return
      const hc = document.createElement("canvas")
      hc.width = src.width * 2; hc.height = src.height * 2
      const hctx = hc.getContext("2d")!
      hctx.scale(2, 2); hctx.drawImage(src, 0, 0)
      hc.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.download = `studio-puffer-${selectedModel.id}-${Date.now()}.png`
        a.href = url; a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }, "image/png", 1.0)
      return
    }

    // Modelos com foto PNG: renderiza versão limpa (fundo transparente) para download
    const sz = { tote: {w:760,h:800}, shoulder:{w:710,h:760}, crossbody:{w:460,h:510}, mini:{w:400,h:460} }
    const s = (sz as any)[selectedModel.id] || sz.tote
    const sc = scale / 100

    const hc = document.createElement("canvas")
    hc.width = s.w * 2; hc.height = s.h * 2
    const hctx = hc.getContext("2d")!
    hctx.scale(2, 2)
    const bagImg = new Image()
    bagImg.onload = () => {
      // Para download: usa pixel-a-pixel para fundo transparente
      drawColoredBagImage(hctx, bagImg, s.w, s.h, selectedColor)
      if (edgeDataRef.current) {
        overlayEmbroidery(hctx, s.w, s.h, sc, posX, posY, lineW, selectedColor, edgeDataRef.current)
      }
      hc.toBlob((blob) => {
        if (!blob) return;
		console.log("gerou blob");
	    console.log(blob);
		lastBlobRef.current = blob   // guarda para enviar à IA
        setAiEnabled(true)
        setAiResult(null)
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.download = `studio-puffer-${selectedModel.id}-${Date.now()}.png`
        a.href = url; a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }, "image/png", 1.0)
    }
    bagImg.src = selectedModel.imgUrl
  }
 /* ── IA Enhance ── */
async function handleAiEnhance() {
  if (!lastBlobRef.current) return

  setAiLoading(true)
  setAiError(null)
  setAiResult(null)
  setShowAiModal(true)

  try {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY
    const formData = new FormData()
    formData.append("image", lastBlobRef.current)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)

    const res = await fetch("https://blendibox-studio.blendibox.workers.dev/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`
      },
      body: formData,
      signal: controller.signal,
    })
    clearTimeout(timeout)

    // Debug — abra o DevTools (F12) > Console para ver
    console.log("Worker status:", res.status)
    console.log("Worker content-type:", res.headers.get("content-type"))
	
	//  erro real:
	const errorBody = await res.json()
	console.log('Worker error body:', errorBody)

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Erro ${res.status}: ${errText}`)
    }

    // Verifica se a resposta é JSON (erro) em vez de imagem
    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const json = await res.json()
      throw new Error(json.error || "Resposta inesperada do servidor")
    }

    const blob = await res.blob()
    console.log("Blob recebido:", blob.size, "bytes, tipo:", blob.type)

    if (blob.size === 0) {
      throw new Error("Resposta vazia do servidor")
    }

    const url = URL.createObjectURL(blob)
    setAiResult(url)
  } catch (e: any) {
    if (e.name === "AbortError") {
      setAiError("Tempo esgotado — a IA demorou mais de 120 segundos. Tente novamente.")
    } else {
      setAiError(e.message || "Erro ao processar com IA")
    }
  } finally {
    setAiLoading(false)
  }
}

 function handleAiDownload() {
    if (!aiResult) return
    const a = document.createElement("a")
    a.download = `blendibox-ai-${selectedModel.id}-${Date.now()}.png`
    a.href = aiResult
    a.click()
  }
  /* ── Reset ── */
  function handleReset() {
    setT1(80); setT2(160); setLineW(2)
    setScale(60); setPosX(0); setPosY(0)
  }

  /* ── Drag & Drop ── */
  function onDragOver(e: React.DragEvent) { e.preventDefault() }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f?.type.startsWith("image/")) loadFile(f)
  }

  /* ═══════════════════════════════════════════════
     JSX
  ═══════════════════════════════════════════════ */
  return (
    <>
      {/* OpenCV via next/script — carrega após hydration */}
      <Script
        src="https://docs.opencv.org/4.x/opencv.js"
        strategy="afterInteractive"
      />

     
      <style>{`
        /* ── Reset ── */
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { height:100%; overflow-y:auto; }

        /* ── Variables ── */
        :root {
          --pk:   #D4A574;
          --pk2:  #E8C49A;
          --pur:  #8B7355;
          --bg:   #F5F1ED;
          --bg2:  #EDE8E2;
          --surf: #FFFFFF;
          --surf2:#F0EBE4;
          --bdr:  rgba(212,165,116,.35);
          --bdr2: rgba(139,115,85,.15);
          --txt:  #1a1a1a;
          --txt2: #666;
          --glow: rgba(212,165,116,.35);
          --r:    4px;
        }

        /* ── Background ── */
        .bg-mesh {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(ellipse 60% 40% at 90% 5%, rgba(212,165,116,.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 5% 90%, rgba(212,165,116,.08) 0%, transparent 55%);
        }

        /* ── Header ── */
        header {
	      margin-top:100px;		
          position:relative; z-index:2;
          display:flex; align-items:center; justify-content:space-between;
          padding:.6rem 1.5rem;
          border-bottom:2px solid rgba(212,165,116,.3);
          background:rgba(255,255,255,.98);
          backdrop-filter:blur(10px);
          gap:1rem; flex-wrap:wrap;
          height:56px;
          box-shadow:0 2px 12px rgba(0,0,0,.06);
        }
        .logo-row { display:flex; align-items:center; gap:.6rem; }
        .logo-gem {
          width:34px; height:34px;
          background:var(--txt); border-radius:4px;
          display:flex; align-items:center; justify-content:center;
          font-size:1rem;
        }
        h1 {
          font-family:'Playfair Display',serif;
          font-size:1.5rem; font-weight:900; letter-spacing:-.5px;
          color:var(--txt); white-space:nowrap;
        }
        h1 span { color:var(--pk); font-style:italic; }
        #statusBar {
          display:flex; align-items:center; gap:.5rem;
          padding:.35rem 1rem; border-radius:2px;
          font-size:.75rem; font-weight:600; letter-spacing:.03em;
          background:var(--surf2); border:1px solid var(--bdr);
          white-space:nowrap; color:var(--txt2);
        }
        .status-dot {
          width:7px; height:7px; border-radius:50%;
          background:var(--txt2); flex-shrink:0;
        }
        #statusBar.ready .status-dot { background:#22c55e; box-shadow:0 0 6px #22c55e88; }
        #statusBar.busy  .status-dot { background:var(--pk); animation:blink .6s infinite; }
        #statusBar.error .status-dot { background:#ef4444; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

        /* ── Workspace ── */
        .workspace {
          position:relative; z-index:2;
          display:grid;
          grid-template-columns:380px 1fr;
          gap:clamp(.5rem,1vh,1.2rem);
          max-width:1600px; margin:0 auto;
          padding:clamp(.4rem,.8vh,.9rem) 1.2rem;
          /* Ocupa a tela sem ultrapassar — cresce se precisar */
          height:calc(100dvh - 56px);
          min-height:500px;
          box-sizing:border-box;
          /* overflow visível no eixo X, oculto no Y para não vazar */
          overflow:hidden;
          background:var(--bg);
        }

        /* ── Sidebar ── */
        .sidebar-wrap {
          height:100%; min-height:0; position:relative;
          display:flex; flex-direction:column;
          /* contém a sidebar sem vazar para fora do workspace */
          overflow:hidden;
        }
        .sidebar {
          flex:1; min-height:0;
          overflow-y:auto; overflow-x:hidden;
          scrollbar-width:thin; scrollbar-color:var(--bdr) transparent;
          padding-right:4px; padding-bottom:.5rem;
        }
        .sidebar::-webkit-scrollbar { width:4px; }
        .sidebar::-webkit-scrollbar-thumb { background:var(--bdr); border-radius:4px; }

        /* ── Scroll hint ── */
        .scroll-hint {
          position:absolute; bottom:58px; left:50%;
          transform:translateX(-50%);
          display:flex; flex-direction:column; align-items:center; gap:4px;
          pointer-events:none; z-index:10;
          transition:opacity .4s ease;
        }
        .scroll-hint-arrow {
          width:32px; height:32px; background:var(--pk);
          border-radius:50%; display:flex; align-items:center;
          justify-content:center; font-size:1rem; color:#1a1a1a;
          box-shadow:0 4px 16px var(--glow);
          animation:bounceDown 1.4s ease-in-out infinite;
        }
        .scroll-hint-label {
          font-size:.68rem; font-weight:700; color:var(--txt);
          letter-spacing:.04em; text-transform:uppercase;
          background:rgba(255,255,255,.9); padding:.15rem .5rem;
          border-radius:3px; border:1px solid var(--bdr);
        }
        @keyframes bounceDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

        /* ── Sidebar footer ── */
        .sidebar-footer {
          flex-shrink:0;
          padding:.4rem 4px .2rem 0;
          border-top:2px solid rgba(212,165,116,.25);
          margin-top:.2rem;
        }
        .btn-row { display:flex; gap:.5rem; align:right; }

        /* ── Panel ── */
        .panel {
          background:var(--surf);
          border:1px solid var(--bdr2);
          border-left:3px solid var(--pk);
          border-radius:var(--r);
          padding:clamp(.5rem,1.2vh,1.1rem) 1.2rem;
          margin-bottom:clamp(.3rem,.8vh,.9rem);
          box-shadow:0 2px 12px rgba(0,0,0,.05);
        }
        .panel-head {
          display:flex; align-items:center; gap:.6rem;
          margin-bottom:clamp(.3rem,.6vh,.8rem);
          padding-bottom:clamp(.3rem,.6vh,.6rem);
          border-bottom:1px solid rgba(212,165,116,.2);
        }
        .step-badge {
          width:26px; height:26px; flex-shrink:0;
          background:var(--pk); border-radius:2px;
          display:flex; align-items:center; justify-content:center;
          font-size:.75rem; font-weight:700; color:#1a1a1a;
        }
        h2 {
          font-family:'Playfair Display',serif;
          font-size:clamp(.9rem,1.5vh,1.15rem); font-weight:700;
          letter-spacing:-.01em; color:var(--txt);
        }

        /* ── Upload zone ── */
        .upload-zone {
          border:2px dashed rgba(212,165,116,.5);
          border-radius:4px;
          padding:clamp(.5rem,1.2vh,1.1rem) 1rem;
          text-align:center; cursor:pointer;
          transition:all .3s;
          background:rgba(212,165,116,.04);
        }
        .upload-zone:hover, .upload-zone.drag {
          border-color:var(--pk);
          background:rgba(212,165,116,.1);
          transform:translateY(-1px);
        }
        .upload-zone .ic { font-size:clamp(1.2rem,2.5vh,1.8rem); margin-bottom:.2rem; }
        .upload-zone p   { font-size:.9rem; color:var(--txt2); }
        .upload-zone b   { color:var(--pk); }

        /* ── Thumb wrap ── */
        .thumb-wrap { margin-top:clamp(.4rem,.8vh,1rem); position:relative; }
        #thumbPreview {
          width:100%; border-radius:10px;
          border:1px solid var(--bdr2);
          object-fit:contain;
          max-height:clamp(60px,9vh,110px);
        }
        .thumb-change {
          position:absolute; top:6px; right:6px;
          background:rgba(255,255,255,.92); border:1px solid var(--bdr);
          color:var(--pur); font-size:.72rem; font-weight:700;
          padding:.25rem .6rem; border-radius:4px; cursor:pointer;
          transition:all .2s; box-shadow:0 2px 8px rgba(0,0,0,.12);
        }
        .thumb-change:hover { background:var(--pk); color:#1a1a1a; }

        /* ── Controls ── */
        .ctrl-group { margin-bottom:clamp(.3rem,.7vh,.85rem); }
        .ctrl-label {
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:clamp(.2rem,.4vh,.55rem);
        }
        .ctrl-label span { font-size:.88rem; font-weight:500; color:var(--txt2); }
        .ctrl-val {
          font-size:.75rem; font-weight:700;
          background:rgba(212,165,116,.18); color:var(--pur);
          padding:.15rem .55rem; border-radius:2px;
        }
        input[type=range] {
          width:100%; height:5px; border-radius:3px;
          background:var(--surf2); outline:none; -webkit-appearance:none; cursor:pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none;
          width:16px; height:16px; border-radius:2px;
          background:var(--pk);
          box-shadow:0 2px 8px rgba(212,165,116,.4);
          transition:transform .15s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.25); }
        .divider { height:1px; background:var(--bdr2); margin:clamp(.3rem,.6vh,.8rem) 0; }

        /* ── Model grid ── */
        .model-grid {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:clamp(.25rem,.5vh,.5rem); margin-top:clamp(.2rem,.4vh,.5rem);
        }
        .model-card {
          border:2px solid var(--bdr2); border-radius:4px;
          padding:clamp(.2rem,.5vh,.45rem) .3rem;
          cursor:pointer; transition:all .3s;
          text-align:center; background:var(--bg2);
          position:relative; overflow:hidden;
        }
        .model-card::before {
          content:''; position:absolute; inset:0;
          background:rgba(212,165,116,.08);
          opacity:0; transition:opacity .3s;
        }
        .model-card:hover { transform:translateY(-2px); border-color:var(--pk); }
        .model-card:hover::before { opacity:1; }
        .model-card.active {
          border-color:var(--pk); border-left:3px solid var(--pur);
          box-shadow:0 4px 16px rgba(212,165,116,.2);
        }
        .model-card.active::before { opacity:1; }
        .model-thumb-img {
          width:100%; aspect-ratio:1; object-fit:cover;
          border-radius:4px; margin-bottom:.3rem; background:var(--surf2);
        }
        .model-thumb-placeholder {
          width:100%; aspect-ratio:1; border-radius:4px; margin-bottom:.3rem;
          display:flex; align-items:center; justify-content:center;
          font-size:clamp(1rem,2vh,1.5rem); transition:background .3s;
        }
        .model-name { font-size:clamp(.65rem,1.2vh,.82rem); font-weight:600; color:var(--txt); }
        .model-dims { font-size:.72rem; color:var(--txt2); }

        /* ── Swatches ── */
        .swatch-grid {
          display:grid; grid-template-columns:repeat(6,1fr);
          gap:clamp(.25rem,.5vh,.4rem); margin-top:clamp(.2rem,.4vh,.5rem);
        }
        .swatch {
          aspect-ratio:1; border-radius:3px; cursor:pointer;
          border:2.5px solid transparent; transition:all .2s;
          position:relative; box-shadow:0 2px 6px rgba(0,0,0,.12);
        }
        .swatch:hover    { transform:translateY(-2px) scale(1.05); }
        .swatch.active   {
          border-color:var(--txt);
          box-shadow:0 0 0 2px var(--bg), 0 0 0 4px var(--txt);
        }
        .swatch::after {
          content:'✓'; position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; font-weight:700; color:#fff;
          text-shadow:0 1px 4px rgba(0,0,0,.5);
          opacity:0; transition:opacity .2s;
        }
        .swatch.active::after { opacity:1; }

        /* ── Buttons ── */
        .btn-dl {
          flex:1;
          background:linear-gradient(135deg,#D4A574 0%,#B8824A 100%);
          color:#1a1a1a; border:none;
          padding:.7rem 1rem; border-radius:2px; cursor:pointer;
          font-weight:800; font-size:.85rem;
          display:flex; align-items:center; justify-content:center; gap:.4rem;
          transition:all .3s; letter-spacing:.5px; text-transform:uppercase;
          box-shadow:0 4px 16px rgba(212,165,116,.5),inset 0 1px 0 rgba(255,255,255,.3);
          position:relative; overflow:hidden;
        }
        .btn-dl::before {
          content:''; position:absolute; top:0; left:-100%;
          width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
          transition:left .5s ease;
        }
        .btn-dl:not(:disabled):hover::before { left:100%; }
        .btn-dl:not(:disabled):hover {
          background:linear-gradient(135deg,#E8C49A 0%,#D4A574 100%);
          transform:translateY(-2px);
          box-shadow:0 8px 24px rgba(212,165,116,.6);
        }
        .btn-dl:disabled { opacity:.35; cursor:not-allowed; filter:grayscale(.5); }
        .btn-sec {
          padding:.65rem .9rem;
          background:var(--surf2); border:1px solid var(--bdr2);
          color:var(--txt2); border-radius:2px; cursor:pointer;
          font-weight:600; font-size:.82rem; transition:all .2s;
        }
        .btn-sec:hover { color:var(--pk); border-color:var(--pk); }

        /* ── Preview panel ── */
        .preview-panel {
          background:var(--surf);
          border:1px solid var(--bdr2); border-top:3px solid var(--pk);
          border-radius:var(--r);
          padding:clamp(.5rem,1.2vh,1.2rem) 1.4rem;
          /* height:100% + min-height:0 = ocupa o espaço sem vazar */
          height:100%; min-height:0;
          display:flex; flex-direction:column;
          box-shadow:0 2px 16px rgba(0,0,0,.06);
          overflow:hidden;
        }
        .preview-panel .panel-head { margin-bottom:.8rem; }
        .preview-stage {
          flex:1; min-height:0;
          background:linear-gradient(135deg,#F0EBE3 0%,#E8E0D5 100%);
          border-radius:4px; border:1px solid rgba(212,165,116,.25);
          display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
        }
        .preview-stage::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212,165,116,.1) 0%, transparent 70%);
          pointer-events:none;
        }
        #bagPreviewArea {
          position:relative; width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
        }
        #bagCanvas {
          max-width:95%; max-height:100%; width:auto; height:auto;
          border-radius:10px;
          filter:drop-shadow(0 20px 60px rgba(0,0,0,.15));
        }
        .preview-placeholder { text-align:center; padding:4rem 2rem; }
        .preview-placeholder .big-ic { font-size:5rem; opacity:.15; filter:sepia(1); }
        .preview-placeholder p { font-size:1rem; color:var(--txt2); margin-top:1.2rem; }

        /* ── Loading overlay ── */
        #loadingOverlay {
          display:none; position:fixed; inset:0;
          background:rgba(245,241,237,.9); z-index:999;
          align-items:center; justify-content:center;
          flex-direction:column; gap:1.2rem;
          backdrop-filter:blur(8px);
        }
        #loadingOverlay.show { display:flex; }
        .spinner {
          width:48px; height:48px;
          border:3px solid rgba(212,165,116,.2);
          border-top-color:var(--pk); border-radius:50%;
          animation:spin .7s linear infinite;
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        #loadingOverlay p { font-size:1rem; color:var(--txt); font-weight:600; }

        /* ══════════════════════════════════
           RESPONSIVO
        ══════════════════════════════════ */

        /* Telas grandes: sidebar um pouco maior */
        @media (min-width: 1400px) {
          .workspace { grid-template-columns: 420px 1fr; }
        }
        @media (min-width: 1800px) {
          .workspace { grid-template-columns: 460px 1fr; }
        }

        @media (max-width: 1100px) {
          .workspace { grid-template-columns: 340px 1fr; gap:.8rem; padding:.7rem 1rem; }
        }

        /* Tablet portrait — preview em cima, controles embaixo */
        @media (max-width: 860px) {
          html, body { height:auto; overflow-y:auto; }
          .workspace {
            grid-template-columns:1fr;
            grid-template-areas:"preview" "controls";
            height:auto; overflow:visible;
            padding:.8rem; gap:.8rem;
          }
          .sidebar-wrap  { grid-area:controls; height:auto; }
          .sidebar       { overflow-y:visible; height:auto; padding-right:0; }
          .scroll-hint   { display:none !important; }
          .preview-panel { grid-area:preview; height:auto; min-height:55vw; max-height:72vw; }
          .preview-stage { min-height:44vw; max-height:60vw; }
          .sidebar-footer { position:static; }
        }

        /* Telas com pouca altura (laptops pequenos) */
        @media (max-height: 700px) and (min-width: 861px) {
          .workspace {
            height:calc(100dvh - 56px);
            padding:.4rem .9rem;
            gap:.4rem;
          }
          .panel { padding:.5rem .9rem; margin-bottom:.4rem; }
          .panel-head { margin-bottom:.4rem; padding-bottom:.3rem; }
          .ctrl-group { margin-bottom:.4rem; }
          .upload-zone { padding:.6rem .8rem; }
          .upload-zone .ic { font-size:1.3rem; margin-bottom:.1rem; }
          .model-dims { display:none; }
          #thumbPreview { max-height:70px; }
        }

        /* Telas com pouca altura (laptops) */

        @media (max-width: 600px) {
          header { padding:.5rem .9rem; height:48px; }
          .workspace { padding:.6rem .7rem; gap:.6rem;
            height:auto;
            /* sobrescreve calc(100dvh) do desktop */
            min-height:unset;
          }
          h1 { font-size:1.25rem; }
          .logo-gem { width:28px; height:28px; font-size:.85rem; }
          .preview-panel { min-height:62vw; max-height:75vw; padding:.7rem .9rem; }
          .preview-stage { min-height:50vw; max-height:65vw; }
          .panel  { padding:.8rem .9rem; margin-bottom:.5rem; }
          .upload-zone .ic { font-size:1.5rem; }
          .upload-zone p   { font-size:.8rem; }
          #thumbPreview    { max-height:80px; }
          .ctrl-group      { margin-bottom:.55rem; }
          .ctrl-label span { font-size:.8rem; }
          input[type=range] { height:4px; }
          input[type=range]::-webkit-slider-thumb { width:14px; height:14px; }
          .model-name { font-size:.6rem; }
          .model-dims { display:none; }
          .model-thumb-placeholder { font-size:1.2rem; }
          .swatch-grid { gap:.3rem; }
          .btn-dl  { font-size:.78rem; padding:.6rem .7rem; }
          .btn-sec { font-size:.78rem; padding:.6rem .6rem; }
          #statusBar { font-size:.7rem; padding:.25rem .7rem; }
        }

        @media (max-width: 400px) {
          h1 { font-size:1.1rem; }
          .workspace { padding:.4rem .5rem; gap:.4rem; }
          .preview-panel { min-height:68vw; max-height:80vw; }
          .panel { padding:.65rem .75rem; }
          .model-card { padding:.3rem .2rem; }
          .btn-dl { font-size:.72rem; letter-spacing:0; }
        }
	        /* ══ Botão IA ══ */
        .btn-ai {
          display:inline-flex; align-items:center; gap:.45rem;
          padding:.65rem 1.1rem;
          background:linear-gradient(135deg,#7C3AED,#4F46E5);
          color:#fff; border:none; border-radius:2px; cursor:pointer;
          font-weight:700; font-size:.8rem; letter-spacing:.4px;
          text-transform:uppercase;
          box-shadow:0 4px 18px rgba(124,58,237,.35),inset 0 1px 0 rgba(255,255,255,.2);
          transition:all .3s; position:relative; overflow:hidden; flex-shrink:0;
        }
        .btn-ai::before {
          content:''; position:absolute; top:0; left:-100%;
          width:100%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
          transition:left .5s;
        }
        .btn-ai:not(:disabled):hover::before { left:100%; }
        .btn-ai:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(124,58,237,.5); }
        .btn-ai:disabled { opacity:.4; cursor:not-allowed; }
        .ai-spinner {
          width:13px; height:13px; flex-shrink:0;
          border:2px solid rgba(255,255,255,.3);
          border-top-color:#fff; border-radius:50%;
          animation:spin .6s linear infinite;
        }

        /* ══ Modal IA ══ */
        .ai-modal-overlay {
          position:fixed; inset:0; z-index:9000;
          background:rgba(15,10,20,.7); backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center;
          padding:1.5rem; animation:fadeInModal .25s ease;
        }
        @keyframes fadeInModal { from{opacity:0} to{opacity:1} }
        .ai-modal {
          background:#fff; border-radius:8px; width:100%; max-width:860px;
          box-shadow:0 24px 80px rgba(0,0,0,.3); overflow:hidden;
          animation:slideUpModal .3s cubic-bezier(.16,1,.3,1);
        }
        @keyframes slideUpModal { from{transform:translateY(30px);opacity:0} to{transform:none;opacity:1} }
        .ai-modal-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:.9rem 1.3rem;
          border-bottom:1px solid rgba(139,115,85,.15);
          background:linear-gradient(135deg,#F5F1ED,#EDE8E2);
        }
        .ai-modal-title {
          display:flex; align-items:center; gap:.55rem;
          font-family:'Playfair Display',serif;
          font-size:1.1rem; font-weight:700; color:#1a1a1a;
        }
        .ai-badge {
          background:linear-gradient(135deg,#7C3AED,#4F46E5);
          color:#fff; font-size:.62rem; font-weight:800;
          padding:.14rem .42rem; border-radius:3px; letter-spacing:.05em;
        }
        .ai-modal-close {
          background:none; border:none; cursor:pointer;
          font-size:1.3rem; color:#666; padding:.2rem .5rem;
          border-radius:4px; transition:all .2s; line-height:1;
        }
        .ai-modal-close:hover { background:rgba(0,0,0,.08); color:#1a1a1a; }
        .ai-modal-body { padding:1.2rem; }
        .ai-compare {
          display:grid; grid-template-columns:1fr 1fr; gap:1rem;
        }
        .ai-compare-item { display:flex; flex-direction:column; gap:.5rem; }
        .ai-compare-label {
          font-size:.72rem; font-weight:700; text-transform:uppercase;
          letter-spacing:.06em; color:#8B7355;
          display:flex; align-items:center; gap:.4rem;
        }
        .ai-compare-label span {
          display:inline-block; width:8px; height:8px; border-radius:50%;
        }
        .ai-compare-img {
          width:100%; aspect-ratio:1; object-fit:contain;
          border-radius:6px; border:1px solid rgba(139,115,85,.15); background:#F5F1ED;
        }
        .ai-loading-area {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; gap:1rem; padding:2.5rem 1rem; grid-column:1/-1;
        }
        .ai-big-spinner {
          width:48px; height:48px;
          border:3px solid rgba(124,58,237,.15);
          border-top-color:#7C3AED; border-radius:50%;
          animation:spin .8s linear infinite;
        }
        .ai-loading-text { font-family:'Playfair Display',serif; font-size:1.05rem; font-weight:600; color:#1a1a1a; }
        .ai-loading-sub  { font-size:.82rem; color:#666; text-align:center; line-height:1.5; }
        .ai-error { grid-column:1/-1; text-align:center; padding:2rem 1rem; }
        .ai-error-icon { font-size:2.2rem; margin-bottom:.6rem; }
        .ai-error p    { color:#ef4444; font-weight:600; }
        .ai-error small{ display:block; color:#888; margin-top:.3rem; font-size:.82rem; }
        .ai-modal-footer {
          display:flex; align-items:center; justify-content:flex-end; gap:.65rem;
          padding:.8rem 1.3rem; border-top:1px solid rgba(139,115,85,.15); background:#FAFAF8;
        }
        @media (max-width:580px) {
          .ai-compare { grid-template-columns:1fr; }
          .ai-modal-body { padding:.8rem; }
        }							
      `}</style>

      {/* Hidden OpenCV canvases */}
      <canvas ref={inputCanvasRef} id="inputCanvas" style={{ display: "none" }} />
      <canvas ref={edgeCanvasRef}  id="edgeCanvas"  style={{ display: "none" }} />

      <div className="bg-mesh" />

   <Menu/>
      {/* ── Header ── */}
      <header>
        <div className="logo-row">
          <div className="logo-gem">👜</div>
          <h1>Blendibox <span>Puffer Studio</span></h1>
        </div>
        <div id="statusBar" className={statusType}>
          <div className="status-dot" />
          <span>{statusMsg}</span>
        </div>
      </header>

      {/* ── Workspace ── */}
      <div className="workspace">

        {/* ── Sidebar ── */}
        <div className="sidebar-wrap">
          <div
            className="sidebar"
            id="sidebarScroll"
            ref={sidebarRef}
            onScroll={handleSidebarScroll}
          >
            {/* 1. Upload */}
            <div className="panel">
              <div className="panel-head">
                <div className="step-badge">1</div>
                <h2>Sua Imagem</h2>
              </div>
              <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
                <div className="ic">🎨</div>
                <p><b>Clique ou arraste</b> para enviar</p>
                <p>JPG, PNG, GIF · até 10 MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files?.[0]) loadFile(e.target.files[0]) }}
              />
              {thumbSrc && (
                <div className="thumb-wrap">
                  <img id="thumbPreview" src={thumbSrc} alt="preview" />
                  <button className="thumb-change" onClick={() => fileInputRef.current?.click()}>
                    🔄 Trocar
                  </button>
                </div>
              )}
            </div>

            {/* 2. Controles */}
            {showCtrl && (
              <div className="panel" id="ctrlPanel">
                <div className="panel-head">
                  <div className="step-badge">2</div>
                  <h2>Ajustes do Quilted</h2>
                </div>

                <div className="ctrl-group" style={{display:'none'}}>
                  <div className="ctrl-label">
                    <span>Sensibilidade de Borda</span>
                    <span className="ctrl-val">{t1}</span>
                  </div>
                  <input type="range" min={10} max={200} value={t1}
                    onChange={(e) => setT1(Number(e.target.value))} />
                </div>

                <div className="ctrl-group" style={{display:'none'}}>
                  <div className="ctrl-label">
                    <span>Detalhe</span>
                    <span className="ctrl-val">{t2}</span>
                  </div>
                  <input type="range" min={30} max={350} value={t2}
                    onChange={(e) => setT2(Number(e.target.value))} />
                </div>

                <div className="ctrl-group" style={{display:'none'}}>
                  <div className="ctrl-label">
                    <span>Espessura da Costura</span>
                    <span className="ctrl-val">{lineW}px</span>
                  </div>
                  <input type="range" min={1} max={6} step={1} value={lineW}
                    onChange={(e) => setLineW(Number(e.target.value))} />
                </div>

                <div className="divider" />

                <div className="ctrl-group">
                  <div className="ctrl-label">
                    <span>Tamanho do Bordado</span>
                    <span className="ctrl-val">{scale}%</span>
                  </div>
                  <input type="range" min={20} max={100} value={scale}
                    onChange={(e) => setScale(Number(e.target.value))} />
                </div>

                <div className="ctrl-group">
                  <div className="ctrl-label">
                    <span>Posição X</span>
                    <span className="ctrl-val">{posX}</span>
                  </div>
                  <input type="range" min={-40} max={40} value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))} />
                </div>

                <div className="ctrl-group">
                  <div className="ctrl-label">
                    <span>Posição Y</span>
                    <span className="ctrl-val">{posY}</span>
                  </div>
                  <input type="range" min={-40} max={40} value={posY}
                    onChange={(e) => setPosY(Number(e.target.value))} />
                </div>
              </div>
            )}

            {/* 3. Modelo */}
            <div className="panel">
              <div className="panel-head">
                <div className="step-badge">3</div>
                <h2>Escolha o Produto</h2>
              </div>
              <div className="model-grid" id="modelGrid">
                {BAG_MODELS.map((m) => (
                  <div
                    key={m.id}
                    className={`model-card${selectedModel.id === m.id ? " active" : ""}`}
                    onClick={() => { setSelectedModel(m) }}
                  >
                    {m.imgUrl
                      ? <img src={m.imgUrl} className="model-thumb-img" alt={m.name} style={{ background: selectedColor.grad[0] }} />
                      : <div
                          className="model-thumb-placeholder"
                          id={`mtp-${m.id}`}
                          style={{ background: selectedColor.grad[0] }}
                        />
                    }
                    <div className="model-name">{m.name}</div>
                    <div className="model-dims">{m.dims}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Cor */}
            <div className="panel">
              <div className="panel-head">
                <div className="step-badge">4</div>
                <h2>Escolha a Cor</h2>
              </div>
              <div className="swatch-grid" id="swatchGrid">
                {BAG_COLORS.map((c) => (
                  <div
                    key={c.hex}
                    className={`swatch${selectedColor.hex === c.hex ? " active" : ""}`}
                    style={{ background: `linear-gradient(135deg,${c.grad[0]},${c.grad[1]})` }}
                    title={c.label}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>{/* /sidebar scroll */}

          {/* Seta flutuante */}
          {showHint && !hintDismissed && (
            <div className="scroll-hint" id="scrollHint">
              <div className="scroll-hint-arrow">↓</div>
              <span className="scroll-hint-label">Rolar</span>
            </div>
          )}

          {/* Footer fixo */}
          <div className="sidebar-footer">
           
          </div>
        </div>{/* /sidebar-wrap */}

        {/* ── Preview ── */}
        <div className="preview-panel">
          <div className="panel-head">
            <div className="step-badge">5</div>
            <h2>Preview do Produto</h2>
			<div>
			
			 <div className="btn-row">
              <button className="btn-dl" disabled={!dlEnabled} onClick={handleDownload}>
                💾 Baixar Preview
              </button>
			  {aiEnabled && (
                <button className="btn-ai" disabled={aiLoading} onClick={handleAiEnhance}
                  title="Melhorar imagem com Inteligência Artificial">
                  {aiLoading
                    ? <><span className="ai-spinner"/>Aguarde…</>
                    : <>✨ Melhorar com IA</>}
                </button>
              )}				
           <button className="btn-sec" onClick={handleReset}>↺</button>
            </div>
			</div>
			
          </div>
          <div className="preview-stage">
            <div id="bagPreviewArea">
              {!dlEnabled && (
                <div className="preview-placeholder" id="previewPlaceholder">
                  <div className="big-ic">✨</div>
                  <p>Envie uma imagem para<br />visualizar sua bolsa personalizada</p>
                </div>
              )}
              <canvas
                ref={bagCanvasRef}
                id="bagCanvas"
                style={{ background: selectedColor.grad[0] , display: dlEnabled ? "block" : "none" }}
              />
            </div>
          </div>
        </div>

      </div>{/* /workspace */}
  {/* ══ Modal IA — comparação antes × depois ══ */}
      {showAiModal && (
        <div className="ai-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAiModal(false) }}>
          <div className="ai-modal">
            <div className="ai-modal-header">
              <div className="ai-modal-title">
                <span className="ai-badge">AI</span>
                Melhorado com IA
              </div>
              <button  className="ai-modal-close" onClick={() => setShowAiModal(false)}>✕</button>
            </div>

            <div className="ai-modal-body">
              <div className="ai-compare">

                {aiLoading && (
                  <div className="ai-loading-area">
                    <div className="ai-big-spinner"/>
                    <p className="ai-loading-text">Gerando versão melhorada…</p>
                    <p className="ai-loading-sub">
                      Estamos melhorando a imagem... Aguarde alguns segundos.
                    </p>
                  </div>
                )}

                {!aiLoading && aiError && (
                  <div className="ai-error">
                    <div className="ai-error-icon">⚠️</div>
                    <p ></p>
                    <small>Serviço de IA inativo. Tente novamente mais tarde.</small>
                  </div>
                )}


                {!aiLoading && !aiError && aiResult && (
                  <>
                    <div className="ai-compare-item">
                      <div className="ai-compare-label">
                        <span style={{background:"#D4A574"}}/>Original
                      </div>
                      <canvas style={{ background: selectedColor.grad[0] }}
                        className="ai-compare-img"
                        ref={(el) => {
                          if (!el || !bagCanvasRef.current) return
                          el.width  = bagCanvasRef.current.width
                          el.height = bagCanvasRef.current.height
                          el.getContext("2d")!.drawImage(bagCanvasRef.current, 0, 0)
                        }}
                      />
                    </div>
                    <div className="ai-compare-item">
                      <div className="ai-compare-label">
                        <span style={{background:"#7C3AED"}}/>Melhorado com IA
                      </div>
                      <img src={aiResult} alt="Resultado IA" className="ai-compare-img"/>
                    </div>
                  </>
                )}

              </div>
            </div>

            {!aiLoading && !aiError && aiResult && (
              <div className="ai-modal-footer">
                <button className="btn-sec" onClick={() => setShowAiModal(false)}>Fechar</button>
                <button className="btn-ai" onClick={handleAiDownload}>
                  💾 Baixar Versão IA
                </button>
              </div>
            )}
            {!aiLoading && aiError && (
              <div className="ai-modal-footer">
                <button className="btn-sec" onClick={() => setShowAiModal(false)}>Fechar</button>
                <button className="btn-ai" onClick={handleAiEnhance}>🔄 Tentar novamente</button>
              </div>
            )}
          </div>
		  
		   
        </div>
		
      )}							   
			<Footer/>					   
      {/* Loading overlay */}
      <div id="loadingOverlay" className={loading ? "show" : ""}>
        <div className="spinner" />
        <p>{loadingMsg}</p>
      </div>
	 
    </>
  )
}
