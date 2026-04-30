# 新产品上架工作流程

**创建日期**: 2026-04-30  
**产品型号**: D601（首个参考案例）

---

## 📋 任务概述

将新产品（以 D601 为例）上架到网站，支持多语言展示，并归类到正确的产品类别。

---

## 📥 输入材料

从产品经理/供应商处获取：

| 材料 | 格式 | 用途 |
|------|------|------|
| 产品规格书 | XLS/XLSX（中文） | 提取产品参数、功能特性 |
| 产品图片 | PNG/JPG（3-5 张） | 产品展示 |
| 产品名称 | 文本 | 如"D601 4G 6 通道双卡智能车载终端" |

---

## 📁 项目结构（当前）

```
fleetgoo.com/
├── public/
│   ├── data/
│   │   ├── {lang}/
│   │   │   ├── products.json              # 产品列表页数据
│   │   │   └── products/
│   │   │       └── {product-id}.json      # 产品详情页数据
│   │   └── images/
│   │       └── products/                  # 产品图片
│   └── ...
```

**支持的语言**: `zh`（中文）, `en`（英文）, `es`（西班牙文）, `ja`（日文）, `th`（泰文）

---

## 🔧 执行步骤

### Step 1: 读取规格书（XLSX）

使用 Python + openpyxl 解析 Excel 文件：

```python
import openpyxl
wb = openpyxl.load_workbook('规格书.xlsx')
ws = wb.active
for row in ws.iter_rows():
    print([cell.value for cell in row])
```

**提取关键字段**:
- 产品特色（features）
- 规格参数（parameters）
- 包装清单（packaging）
- 操作系统、处理器、内存等核心配置

---

### Step 2: 复制产品图片

将图片从临时目录复制到项目图片目录，并重命名：

```bash
cp tmp/D601-主图.png       public/images/products/D601-main.png
cp tmp/D601-不同角度.png   public/images/products/D601-02.png
cp tmp/D601-主机 + 配件.png public/images/products/D601-03.png
cp tmp/D601-应用场景.jpg   public/images/products/D601-04.jpg
```

**命名规则**: `{型号}-{序号}.{ext}`，主图使用 `main`。

---

### Step 3: 创建产品详情 JSON 文件

为每种语言创建产品详情文件：

**文件路径**: `public/data/{lang}/products/{product-id}.json`

**JSON 结构**:
```json
{
  "id": "d601-6ch-ai-dashcam-terminal",
  "categoryId": "4g-aicarbox",
  "title": "D601 4G 6 通道双卡智能车载终端",
  "metaTitle": "D601 4G 6 通道双卡智能车载终端 | 多路视频监控",
  "metaDesc": "简短描述（SEO）",
  "fullDescription": "完整产品描述",
  "images": [
    "/images/products/D601-main.png",
    "/images/products/D601-02.png",
    "/images/products/D601-03.png",
    "/images/products/D601-04.jpg"
  ],
  "features": [
    "特性 1",
    "特性 2",
    "特性 3"
  ],
  "parameters": [
    { "label": "处理器", "value": "RV1126B Quad A53 1.5GHz" },
    { "label": "内存", "value": "512MB + 512MB" }
  ],
  "downloads": [],
  "packaging": "1x 主机，1x 配件...",
  "icon": "Video"
}
```

**多语言翻译**:
- 中文 → 英文 → 西班牙文 → 日文 → 泰文
- 注意保持 `id`、`categoryId`、`images`、`icon` 字段一致

---

### Step 4: 确定产品分类

根据产品特性选择 `categoryId`：

| Category ID | 中文名称 | 适用产品 |
|-------------|----------|----------|
| `gps-tracker` | GPS 定位器 | C08W, C08L |
| `4g-dashcam` | 4G 行车记录仪 | D501, D701 |
| `4g-aicarbox` | AI 智能主机 | D604, **D601** |
| `4g-camera` | AI 摄像头 | D401, D901 |
| `oem-odm` | OEM/ODM 定制 | 定制服务 |

**D601 归类**: `4g-aicarbox`（与 D604 同类）

---

### Step 5: 更新产品列表页 JSON

更新所有语言的 `public/data/{lang}/products.json` 文件。

**在 `items` 数组中插入新产品**（通常放在同类别产品 D604 之后）：

```json
{
  "id": "d601-6ch-ai-dashcam-terminal",
  "categoryId": "4g-aicarbox",
  "title": "D601 4G 6 通道双卡智能车载终端",
  "description": "支持 6 路 AHD+1 路 IPC 视频输入，4G 全网通/5G 可选，DMS/ADAS/BSD 智能驾驶辅助系统。",
  "image": "/images/products/D601-main.png"
}
```

**Python 插入代码**:
```python
import json

with open('public/data/zh/products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

d604_index = next(i for i, item in enumerate(data['items']) 
                  if item['id'] == 'd604-8ch-mdvr-ai-box-fleet-surveillance')

d601_item = {
    "id": "d601-6ch-ai-dashcam-terminal",
    "categoryId": "4g-aicarbox",
    "title": "D601 4G 6 通道双卡智能车载终端",
    "description": "支持 6 路 AHD+1 路 IPC 视频输入...",
    "image": "/images/products/D601-main.png"
}

data['items'].insert(d604_index + 1, d601_item)

with open('public/data/zh/products.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
```

---

## ✅ 验证清单

完成上架后，检查以下项目：

- [ ] 5 个语言的产品详情 JSON 文件已创建
- [ ] 5 个语言的 products.json 列表已更新
- [ ] 所有 `categoryId` 一致且正确
- [ ] 图片路径正确且文件存在
- [ ] JSON 格式有效（无语法错误）
- [ ] 产品图片已复制到正确目录

**验证命令**:
```bash
# 检查 D601 是否在所有 products.json 中
grep -l "d601-6ch-ai-dashcam-terminal" public/data/*/products.json

# 检查 categoryId 是否一致
grep '"categoryId"' public/data/*/products/d601-6ch-ai-dashcam-terminal.json

# 检查图片文件
ls -la public/images/products/D601*
```

---

## 🛠️ 工具化建议

将上述流程自动化为一个 CLI 工具：

### 工具名称：`add-product`

**输入**:
- 规格书 XLSX 文件路径
- 产品图片目录
- 产品名称
- 目标分类 ID

**自动执行**:
1. 解析 XLSX，提取参数和特性
2. 复制并重命名图片
3. 生成 5 种语言的产品 JSON（使用 AI 翻译）
4. 更新 5 种语言的 products.json 列表
5. 输出验证报告

**命令示例**:
```bash
npm run add-product \
  --specs=tmp/D601-规格书.xlsx \
  --images=tmp/D601-images/ \
  --name="D601 4G 6 通道双卡智能车载终端" \
  --category="4g-aicarbox"
```

---

## 📝 参考文件

- D601 产品详情：`public/data/zh/products/d601-6ch-ai-dashcam-terminal.json`
- D604 产品详情（同类参考）：`public/data/zh/products/d604-8ch-mdvr-ai-box-fleet-surveillance.json`
- 产品列表页：`public/data/zh/products.json`

---

## 🔄 变更记录

| 日期 | 操作 | 产品 | 备注 |
|------|------|------|------|
| 2026-04-30 | 新增 | D601 | 首个参考案例，归类到 `4g-aicarbox` |
