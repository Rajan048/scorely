import traceback
import sys
with open('error_log.txt', 'w', encoding='utf-8') as f:
    try:
        import app.main
    except Exception as e:
        traceback.print_exc(file=f)
