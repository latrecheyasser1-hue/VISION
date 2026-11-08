from pathlib import Path
import subprocess,json,sys
ROOT=Path(__file__).resolve().parent
NAMES={'intro':'01-vision-introduction-fast','commerce':'02-vision-ecommerce-fast','systems':'03-vision-management-fast'}
for film in ([sys.argv[1]] if len(sys.argv)>1 else NAMES):
    stem=NAMES[film];audio='ecommerce' if film=='commerce' else film
    source=ROOT/'renders'/f'{stem}-silent.mp4';mix=ROOT/'audio'/f'{audio}-mix.wav';out=ROOT/'renders'/f'{stem}.mp4'
    if not(source.exists() and mix.exists()):
        print(f'Pending {film}: picture={source.exists()} mix={mix.exists()}',flush=True);continue
    schedule=json.loads((ROOT/f'{film}-schedule.json').read_text(encoding='utf-8'));duration=schedule['duration']
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-i',str(mix),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',str(duration),'-movflags','+faststart',str(out)],check=True)
    subprocess.run(['ffmpeg','-v','error','-i',str(out),'-f','null','-'],check=True)
    report=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(out)]))
    v=next(s for s in report['streams'] if s['codec_type']=='video');a=next(s for s in report['streams'] if s['codec_type']=='audio')
    assert(v['width'],v['height'],v['r_frame_rate'])==(1920,1080,'30/1')
    assert abs(float(report['format']['duration'])-duration)<.1
    assert a['channels']==2
    result={'file':out.name,'duration':report['format']['duration'],'video':'H264 1920x1080 30fps','audio':'AAC stereo48kHz','full_decode':'passed','bytes':out.stat().st_size}
    (ROOT/f'{film}-delivery.json').write_text(json.dumps(result,indent=2))
    subprocess.run(['ffmpeg','-y','-v','error','-ss',str(schedule['scenes'][-1]['start']+2),'-i',str(out),'-frames:v','1','-q:v','2',str(ROOT/'renders'/f'{stem}.jpg')],check=True)
    print(json.dumps(result),flush=True)
