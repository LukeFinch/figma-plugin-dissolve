let exportNode = figma.currentPage.selection[0]

figma.showUI(__html__, {visible: false});


exportNode.exportAsync({
  format: "PNG",
  constraint: {
    type: "SCALE",
    value: 1,
}}
).then(
  resolved => {
    sendToUi(resolved,exportNode.width,exportNode.height)
  },
  rejected => {
    console.error(rejected)
    figma.notify('Promise was rejected')
  }
)


function sendToUi(imagedata,w,h){
  figma.ui.postMessage({type: 'exportImage', data: imagedata, w: w, h:h})
}

figma.ui.onmessage = (message) => {
  console.log("got this from the UI", message)
  
  let image = figma.createImage(message)
  console.log(image)
  let c: any = figma.currentPage.selection[0].clone()
  figma.currentPage.selection[0].visible = false
  c.fills = [{"type":"IMAGE",
  "visible":true,
  "opacity":1,
  "blendMode":"NORMAL",
  "scaleMode":"FILL",
  "imageTransform":[[1,0,0],[0,1,0]],
  "scalingFactor":0.5,"rotation":0,"filters":{"exposure":0,"contrast":0,"saturation":0,"temperature":0,"tint":0,"highlights":0,"shadows":0},
  "imageHash":image.hash}]
  figma.ui.close()
  figma.closePlugin()
}