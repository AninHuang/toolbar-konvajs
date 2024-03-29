import React, { useState, useEffect } from "react";

import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Slider from "@material-ui/core/Slider";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PanIcon from "@material-ui/icons/PanTool";
import PenIcon from "mdi-material-ui/Pen";
import EraserIcon from "mdi-material-ui/Eraser";
import MinWidthIcon from "mdi-material-ui/CircleMedium";
import MaxWidthIcon from "mdi-material-ui/Circle";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

import CanvasContainer from "./CanvasContainer";
import { Annotation, Point, CanvasMode, CanvasProps } from "./types";

type DrilledProps = Partial<
  Pick<
    CanvasProps,
    | "backgroundImageSource"
    | "backgroundAnnotations"
    | "foregroundAnnotation"
    | "onForegroundAnnotationChange"
  >
>;

type OwnProps = {
  transparentToolbar?: boolean;
  drawable?: boolean;
};

type Props = DrilledProps & OwnProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%"
    },
    padding: {
      marginRight: theme.spacing(2)
    },
    sliderContainer: {
      width: theme.spacing(32)
    }
  })
);

const CanvasWithToolbar: React.FC<Props> = ({
  backgroundImageSource = "",
  backgroundAnnotations = [[]],
  foregroundAnnotation = [],
  onForegroundAnnotationChange = annotation => {},
  transparentToolbar = false,
  drawable = false
}: Props) => {
  const classes = useStyles({});

  const [thisForegroundAnnotation, setThisForegroundAnnotation] = useState<
    Annotation
  >(foregroundAnnotation);
  const handleForegroundAnnotationChange = (annotation: Annotation) => {
    setThisForegroundAnnotation(annotation); // update state
    onForegroundAnnotationChange(annotation); // callback upwards
  };
  const handleClearAllClick = event => setThisForegroundAnnotation([]);

  const defaultPosition = { x: 32, y: 32 };
  const [position, setPosition] = useState<Point>(defaultPosition);
  const defaultScale = 1.0;
  const [scale, setScale] = useState<number>(defaultScale);
  const handleViewChange = (position: Point, scale: number) => {
    setPosition(position);
    setScale(scale);
  };
  const handleZoomOutClick = event =>
    setScale(prevValue => Math.max(0.1, Math.floor(prevValue * 0.9 * 10) / 10));
  const handleZoomInClick = event =>
    setScale(prevValue => Math.min(10.0, Math.ceil(prevValue * 1.1 * 10) / 10));
  const handleResetViewClick = event => {
    setPosition(defaultPosition);
    setScale(defaultScale);
  };

  const [canvasMode, setCanvasMode] = useState<CanvasMode>(CanvasMode.View);
  const handleCanvasMode = (event: any, newCanvasMode: CanvasMode) => {
    setCanvasMode(newCanvasMode);
  };

  const [penWidth, setPenWidth] = useState<number>(2);
  const handlePenWidthChange = (event: any, newValue: number | number[]) => {
    setPenWidth(newValue as number);
  };

  const [penColor, setPenColor] = useState<string>("#ff0000");
  const handlePenColorChange = event => setPenColor(event.target.value);

  return (
    <div className={classes.container}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          {drawable && (
            <ToggleButtonGroup
              value={canvasMode}
              exclusive
              onChange={handleCanvasMode}
              aria-label="canvas mode"
              className={classes.padding}
            >
              <ToggleButton value={CanvasMode.View} aria-label="view">
                <PanIcon />
              </ToggleButton>
              <ToggleButton value={CanvasMode.Pen} aria-label="pen">
                <PenIcon />
              </ToggleButton>
              <ToggleButton value={CanvasMode.Eraser} aria-label="eraser">
                <EraserIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          )}
          {canvasMode === CanvasMode.Pen && (
            <>
              <input
                type="color"
                onChange={handlePenColorChange}
                value={penColor}
                className={classes.padding}
              />
              <Grid
                container
                spacing={1}
                className={clsx(classes.sliderContainer, classes.padding)}
              >
                <Grid item>
                  <MinWidthIcon />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={penWidth}
                    onChange={handlePenWidthChange}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item>
                  <MaxWidthIcon />
                </Grid>
              </Grid>
            </>
          )}
          {canvasMode === CanvasMode.Eraser && (
            <Button
              onClick={handleClearAllClick}
              color="inherit"
              className={classes.padding}
            >
              Clear All
            </Button>
          )}
          {canvasMode === CanvasMode.View && (
            <>
              <div className={classes.padding}>
                <IconButton onClick={handleZoomOutClick}>
                  <ZoomOutIcon />
                </IconButton>
                <Typography variant="button">
                  {`${Math.round(scale * 100)}%`}
                </Typography>
                <IconButton onClick={handleZoomInClick}>
                  <ZoomInIcon />
                </IconButton>
              </div>
              <Button
                onClick={handleResetViewClick}
                color="inherit"
                className={classes.padding}
              >
                Reset View
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <CanvasContainer
        backgroundImageSource={backgroundImageSource}
        backgroundAnnotations={backgroundAnnotations}
        foregroundAnnotation={thisForegroundAnnotation}
        onForegroundAnnotationChange={handleForegroundAnnotationChange}
        onViewChange={handleViewChange}
        mode={canvasMode}
        penColor={penColor}
        penWidth={penWidth}
        position={position}
        scale={scale}
      />
    </div>
  );
};

export default CanvasWithToolbar;
