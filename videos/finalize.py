"""Mux locally generated narration and effects, then verify final delivery files."""
import json, subprocess, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent
FILMS=[('intro','intro','01-vision-introduction'),('commerce','ecommerce','02-vision-ecommerce'),('systems','systems','03-vision-management')]
def run(args):
    subprocess.run(args,check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
def finish(item):
    folder,audio,stem=item
    schedule=json.loads((ROOT/folder/'schedule.json').read_text(encoding='utf-8'))
    duration=schedule['duration'];silent=ROOT/'renders'/f'{stem}-silent.mp4';final=ROOT/'renders'/f'{stem}.mp4'
    if not silent.exists():return None
    run(['ffmpeg','-y','-i',str(silent),'-i',str(ROOT/'audio'/audio/'mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',str(duration),'-movflags','+faststart',str(final)])
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(final)]))
    v=next(x for x in probe['streams'] if x['codec_type']=='video');a=next(x for x in probe['streams'] if x['codec_type']=='audio')
    assert (v['width'],v['height'])==(1920,1080)
    assert v['r_frame_rate']=='30/1'
    assert a['channels']==2 and a['sample_rate']=='48000'
    assert abs(float(probe['format']['duration'])-duration)<.1
    # Read the complete encoded file to detect broken packets/frames.
    run(['ffmpeg','-v','error','-i',str(final),'-f','null','-'])
    poster=ROOT/'renders'/f'{stem}.jpg'
    run(['ffmpeg','-y','-ss',str(schedule['scenes'][-1]['start']+4),'-i',str(final),'-frames:v','1','-q:v','2',str(poster)])
    for ext in ['srt','vtt']:shutil.copy2(ROOT/'audio'/audio/f'narration.ar.{ext}',ROOT/'renders'/f'{stem}.ar.{ext}')
    result={'file':str(final.relative_to(ROOT)),'duration':float(probe['format']['duration']),'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'codec':v['codec_name'],'audio_codec':a['codec_name'],'audio_channels':a['channels'],'sample_rate':a['sample_rate'],'bytes':final.stat().st_size,'full_decode':'passed'}
    (ROOT/'qa'/f'{folder}-delivery.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False),flush=True)
    return result
if __name__=='__main__':
    import sys
    selected=[x for x in FILMS if len(sys.argv)<2 or x[0]==sys.argv[1]]
    for item in selected:finish(item)
