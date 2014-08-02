Crafty.extend({
    /**@
* #Crafty.orthogonal
* @category 2D
* Place entities in a grid
*/
    orthogonal:{
        _tile: {
            width: 0,
            height: 0,
            r:0
        },
        
        /**@
        * #Crafty.orthogonal.init
        * @comp Crafty.orthogonal
        * @sign public this Crafty.orthogonal.init(Number tileWidth,Number tileHeight,Number mapWidth,Number mapHeight)
        * @param tileWidth - The size of base tile width in Pixel
        * @param tileHeight - The size of base tile height in Pixel
        * @param mapWidth - The width of whole map in Tiles
        * @param mapHeight - The height of whole map in Tiles
        * 
        * Method used to initialize the size of the grid placement.
        * Recommended to use a size alues in the power of `2` (128, 64 or 32).
        * This makes it easy to calculate positions and implement zooming.
        * 
        * @example
        * ~~~
        * var topdown = Crafty.orthogonal.init(64,128,20,20);
        * ~~~
        * 
        * @see Crafty.orthogonal.place
        */
        init:function(tw, th){
            this._tile.width = parseInt(tw);
            this._tile.height = parseInt(th)||parseInt(tw);
            this._tile.r = this._tile.width / this._tile.height;
                 
            return this;
        },
        /**@
        * #Crafty.orthogonal.place
        * @comp Crafty.orthogonal
        * @sign public this Crafty.orthogonal.place(Entity tile,Number x, Number y, Number layer)
        * @param x - The `x` position to place the tile
        * @param y - The `y` position to place the tile
        * @param layer - The `z` position to place the tile (calculated by y position * layer)
        * @param tile - The entity that should be position in the grid
        * 
        * Use this method to place an entity in a grid.
        * 
        * @example
        * ~~~
        * var topdown = Crafty.orthogonal.init(64,128,20,20);
        * topdown.place(Crafty.e('2D, DOM, Color').color('red').attr({w:128, h:128}),1,1,2);
        * ~~~
        * 
        * @see Crafty.orthogonal.size
        */
        place:function(obj,x,y,layer){
            var pos = this.pos2px(x|0,y|0);
            if(!layer && layer!==0) layer = 1;
            var marginX = 0,marginY = 0;
            if(obj.__margin !== undefined){
                marginX = obj.__margin[0];
                marginY = obj.__margin[1];
            }
          
            obj.x = (pos.left+marginX-(this._tile.width+obj.w)/2)|0; // center of tile
            obj.y = (pos.top+marginY-obj.h)|0; // bottom of tile
            obj.z = y+layer|0;
           
        },
        centerAt:function(x,y){
            var pos = this.pos2px(x,y);
            Crafty.viewport.x = -pos.left*Crafty.viewport._zoom+Crafty.viewport.width/2;
            Crafty.viewport.y = -pos.top*Crafty.viewport._zoom+Crafty.viewport.height/2+this._tile.height*Crafty.viewport._zoom;
        
        },
        area:function(offset){
            // TODO

            if(!offset) offset = 0;
            //calculate the corners
            var vp = Crafty.viewport.rect();
            var ow = offset*this._tile.width;
            var oh = offset*this._tile.height;
            vp._x -= (this._tile.width/2+ow);
            vp._y -= (this._tile.height/2+oh);
            vp._w += (this._tile.width/2+ow);
            vp._h += (this._tile.height/2+oh); 
            /*  Crafty.viewport.x = -vp._x;
            Crafty.viewport.y = -vp._y;    
            Crafty.viewport.width = vp._w;
            Crafty.viewport.height = vp._h;   */
            
            var grid = [];
            for(var y = vp._y,yl = (vp._y+vp._h);y<yl;y+=this._tile.height/2){
                for(var x = vp._x,xl = (vp._x+vp._w);x<xl;x+=this._tile.width/2){
                    var row = this.px2pos(x,y);
                    grid.push([~~row.x,~~row.y]);
                }
            }
            return grid;       
        },
        pos2px:function(x,y){
            return{
                left: x*this._tile.width,
                top:  y*this._tile.height
            }
        },
        px2pos:function(left,top){
            return {
                x: Math.ceil(left / this._tile.width),
                y: Math.ceil(top / this._tile.height)
            }
        },
        
        polygon:function(obj){
     
            obj.requires("Collision");
            var marginX = 0,marginY = 0;
            if(obj.__margin !== undefined){
                marginX = obj.__margin[0];
                marginY = obj.__margin[1];
            }
            var points = [
                [marginX-0, obj.h-marginY-this._tile.height],
                [marginX+this._tile.width, obj.h-marginY-this._tile.height],
                [marginX+this._tile.width, obj.h-marginY],
                [marginX+0, obj.h-marginY]
            ];
            var poly = new Crafty.polygon(points);
            return poly;
           
        },
        
        polygonGrid:function(offset){
            var poly = new Crafty.polygon( [[0,offset],[this._tile.width,offset],[this._tile.width,this._tile.height+offset],[0,this._tile.height+offset]] );
            return poly
        }
       
    }
});

