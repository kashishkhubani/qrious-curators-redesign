@echo off
echo Creating images folder...
if not exist "images" mkdir images

echo Copying project thumbnail images...
copy "C:\Users\kashish Khubani\.gemini\antigravity\brain\4ad0ad14-deee-46ac-a893-597bc3ad7b2e\thumb_luminary_1778063227217.png"   "images\thumb_luminary.png"
copy "C:\Users\kashish Khubani\.gemini\antigravity\brain\4ad0ad14-deee-46ac-a893-597bc3ad7b2e\thumb_nourishmint_1778063346532.png" "images\thumb_nourishmint.png"
copy "C:\Users\kashish Khubani\.gemini\antigravity\brain\4ad0ad14-deee-46ac-a893-597bc3ad7b2e\thumb_vertex_1778063850980.png"     "images\thumb_vertex.png"
copy "C:\Users\kashish Khubani\.gemini\antigravity\brain\4ad0ad14-deee-46ac-a893-597bc3ad7b2e\thumb_solstice_1778064055434.png"   "images\thumb_solstice.png"
copy "C:\Users\kashish Khubani\.gemini\antigravity\brain\4ad0ad14-deee-46ac-a893-597bc3ad7b2e\thumb_archetype_1778064100702.png"  "images\thumb_archetype.png"

echo.
echo Done! All 5 images copied successfully.
pause
