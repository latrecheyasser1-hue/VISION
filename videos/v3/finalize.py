from pathlib import Path
import json,subprocess,sys
ROOT=Path(__file__).resolve().parent
NAMES={'intro':'01-VISION-brand','commerce':'02-VISION-commerce','systems':'03-VISION-systems'}
def run(args):return subprocess.run(args,capture_output=True,text=True,check=True)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
for film in sys.argv[1:] or list(NAMES):
 schedule=json.loads((ROOT/f'{film}-schedule.json').read_text(encoding='utf-8'))
 duration=schedule['duration'];name=NAMES[film];out=ROOT/'renders'/f'{name}.mp4'
 run(['ffmpeg','-y','-v','error','-i',str(ROOT/'renders'/f'{film}-silent.mp4'),'-i',str(ROOT/'audio/mixes'/film/'mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',str(duration),'-movflags','+faststart',str(out)])
 run(['ffmpeg','-v','error','-i',str(out),'-f','null','-'])
 probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]).stdout)
 video=next(s for s in probe['streams'] if s['codec_type']=='video');audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
 assert (video['width'],video['height'],video['avg_frame_rate'])==(1920,1080,'30/1')
 assert audio['channels']==2 and abs(float(probe['format']['duration'])-duration)<.07
 poster=ROOT/'renders'/f'{name}.jpg';t=schedule['scenes'][-1]['start']+schedule['scenes'][-1]['duration']*.82
 run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(out),'-frames:v','1','-q:v','2',str(poster)])
 subtitles=[];number=1
 for scene in schedule['scenes']:
  words=scene['words']
  for i in range(0,len(words),5):
   group=words[i:i+5];start=scene['start']+.18+group[0]['start'];end=scene['start']+.18+group[-1]['start']+group[-1]['duration']
   subtitles.append(f'{number}\n{stamp(start)} --> {stamp(end)}\n'+ ' '.join(w['text'] for w in group)+'\n');number+=1
 (ROOT/'renders'/f'{name}.ar.srt').write_text('\n'.join(subtitles),encoding='utf-8-sig')
 qa={'file':str(out),'duration':float(probe['format']['duration']),'dimensions':[1920,1080],'fps':30,'audio':'AAC stereo48k','fullDecode':'passed','bytes':out.stat().st_size,'voice':schedule['voice']}
 (ROOT/'qa'/f'{film}-delivery.json').write_text(json.dumps(qa,indent=2),encoding='utf-8');print(json.dumps(qa),flush=True)
